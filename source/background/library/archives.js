import {
    Credentials,
    EntryFinder,
    VaultSource,
    createEntryFacade,
    createVaultFacade
} from "../../shared/library/buttercup.js";
import { extractDomain } from "../../shared/library/domain.js";
import { getVaultManager } from "./buttercup.js";
import { getState } from "../redux/index.js";
import { getConfigKey } from "../../shared/selectors/app.js";
import log from "../../shared/library/log.js";
import { MYBUTTERCUP_CLIENT_ID, MYBUTTERCUP_CLIENT_SECRET } from "../../shared/library/myButtercup.js";
import { createNewTab, getCurrentTab, getExtensionURL, sendTabMessage } from "../../shared/library/extension.js";
import { updateContextMenu } from "./contextMenu.js";
import { getSearch } from "./search.js";

const URL_SEARCH_REXP = /^ur[li]$/i;

export function addArchiveByRequest(payload) {
    switch (payload.type) {
        case "dropbox":
            return addDropboxArchive(payload);
        case "googledrive":
            return addGoogleDriveArchive(payload);
        case "webdav":
            return addWebDAVArchive(payload);
        case "localfile":
            return addLocalArchive(payload);
        case "mybuttercup":
            return addMyButtercupArchive(payload);
        default:
            return Promise.reject(new Error(`Unable to add archive: Unknown type: ${payload.type}`));
    }
}

export function addDropboxArchive(payload) {
    const { name, masterPassword, filename, dropboxToken, create } = payload;
    log.info(`Attempting to connect Dropbox archive '${filename}' (${name})`);
    log.info(`New archive will be created for request: ${create}`);
    const rawCredentials = Credentials.fromDatasource(
        {
            type: "dropbox",
            token: dropboxToken,
            path: filename
        },
        masterPassword
    );
    return Promise.all([getVaultManager(), rawCredentials.toSecureString()]).then(
        ([vaultManager, sourceCredentials]) => {
            const source = new VaultSource(name, "dropbox", sourceCredentials);
            return vaultManager.interruptAutoUpdate(() =>
                vaultManager
                    .addSource(source)
                    .then(() => source.unlock(rawCredentials, { initialiseRemote: create }))
                    .then(() => vaultManager.dehydrateSource(source))
            );
        }
    );
}

export function addGoogleDriveArchive(payload) {
    const { name, masterPassword, fileID, googleDriveToken, googleDriveRefreshToken, create } = payload;
    log.info(`Attempting to connect Google Drive archive '${fileID}' (${name})`);
    log.info(`New archive will be created for request: ${create}`);
    const rawCredentials = Credentials.fromDatasource(
        {
            type: "googledrive",
            token: googleDriveToken,
            refreshToken: googleDriveRefreshToken,
            fileID
        },
        masterPassword
    );
    return Promise.all([getVaultManager(), rawCredentials.toSecureString()]).then(
        ([vaultManager, sourceCredentials]) => {
            const source = new VaultSource(name, "googledrive", sourceCredentials);
            return vaultManager.interruptAutoUpdate(() =>
                vaultManager
                    .addSource(source)
                    .then(() => source.unlock(rawCredentials, { initialiseRemote: create }))
                    .then(() => vaultManager.dehydrateSource(source))
            );
        }
    );
}

export function addLocalArchive(payload) {
    const { name, masterPassword, filename, key, create } = payload;
    log.info(`Attempting to connect local archive '${filename}' (${name})`);
    log.info(`New archive will be created for request: ${create}`);
    const rawCredentials = Credentials.fromDatasource(
        {
            type: "localfile",
            path: filename,
            token: key
        },
        masterPassword
    );
    return Promise.all([getVaultManager(), rawCredentials.toSecureString()]).then(
        ([vaultManager, sourceCredentials]) => {
            const source = new VaultSource(name, "localfile", sourceCredentials);
            return vaultManager.interruptAutoUpdate(() =>
                vaultManager
                    .addSource(source)
                    .then(() => source.unlock(rawCredentials, { initialiseRemote: create }))
                    .then(() => vaultManager.dehydrateSource(source))
            );
        }
    );
}

export function addNewEntry(sourceID, groupID, title, username, password, url) {
    log.info(`Adding new login credentials: ${title} (${url})`);
    return getArchive(sourceID)
        .then(archive => {
            const targetGroup = archive.findGroupByID(groupID);
            if (!targetGroup) {
                throw new Error(`Failed adding new entry: No group found for ID: ${groupID}`);
            }
            const entry = targetGroup.createEntry(title);
            entry.setProperty("username", username).setProperty("password", password);
            if (url && url.length > 0) {
                entry.setProperty("URL", url);
            }
        })
        .then(() => saveSource(sourceID));
}

export function addMyButtercupArchive(payload) {
    const { name, masterPassword, accessToken, refreshToken, vaultID, create } = payload;
    log.info(`Attempting to connect My Buttercup vault: ${name}`);
    const rawCredentials = Credentials.fromDatasource(
        {
            type: "mybuttercup",
            accessToken,
            refreshToken,
            clientID: MYBUTTERCUP_CLIENT_ID,
            clientSecret: MYBUTTERCUP_CLIENT_SECRET,
            vaultID
        },
        masterPassword
    );
    return Promise.all([getVaultManager(), rawCredentials.toSecureString()]).then(
        ([vaultManager, sourceCredentials]) => {
            const source = new VaultSource(name, "mybuttercup", sourceCredentials, {
                meta: {
                    vaultID
                }
            });
            return vaultManager.interruptAutoUpdate(() =>
                vaultManager
                    .addSource(source)
                    .then(() => source.unlock(rawCredentials, { initialiseRemote: create }))
                    .then(() => vaultManager.dehydrateSource(source))
                    .then(() => signalMyButtercupTabConnections(vaultID))
            );
        }
    );
}

export function addWebDAVArchive(payload) {
    const { name, masterPassword, filename, url, username, password, create } = payload;
    log.info(`Attempting to connect WebDAV archive '${filename}' from: ${url} (${name})`);
    log.info(`New archive will be created for request: ${create}`);
    const rawCredentials = new Credentials(
        {
            datasource: {
                type: "webdav",
                endpoint: url,
                path: filename,
                username,
                password
            }
        },
        masterPassword
    );
    return Promise.all([getVaultManager(), rawCredentials.toSecureString()]).then(
        ([vaultManager, sourceCredentials]) => {
            const source = new VaultSource(name, "webdav", sourceCredentials);
            return vaultManager.interruptAutoUpdate(() =>
                vaultManager
                    .addSource(source)
                    .then(() => source.unlock(rawCredentials, { initialiseRemote: create }))
                    .then(() => vaultManager.dehydrateSource(source))
            );
        }
    );
}

export function archiveToObjectGroupsOnly(archive) {
    return createVaultFacade(archive);
}

export function changeVaultPassword(sourceID, oldPassword, newPassword, meta) {
    return getVaultManager().then(vaultManager => {
        const source = vaultManager.getSourceForID(sourceID);
        if (!source) {
            throw new Error(`No source found for ID: ${sourceID}`);
        }
        return source.changeMasterPassword(oldPassword, newPassword, meta);
    });
}

export function checkUnlockPossibility() {
    const canAutoUnlock = getConfigKey(getState(), "autoUnlockVaults");
    if (!canAutoUnlock) {
        return Promise.resolve();
    }
    return getVaultManager().then(vaultManager => {
        if (vaultManager.sources.length > 0) {
            createNewTab(getExtensionURL("setup.html#/unlock"));
        }
    });
}

export function generateEntryPath(entry) {
    let group = entry.getGroup(),
        entryPath = [group];
    let parent;
    while ((parent = group.getParentGroup()) !== null) {
        entryPath.unshift(parent);
        group = parent;
    }
    return entryPath.map(pathGroup => pathGroup.getTitle());
}

export function getArchive(sourceID) {
    return getVaultManager().then(vaultManager => {
        const source = vaultManager.getSourceForID(sourceID);
        if (!source) {
            throw new Error(`Unable to fetch archive: No source found for ID: ${sourceID}`);
        }
        if (source.status !== "unlocked") {
            throw new Error(
                `Unable fetch archive: Invalid source state (should be unlocked: ${sourceID}): ${source.status}`
            );
        }
        return source.vault;
    });
}

export function getEntry(sourceID, entryID) {
    return getArchive(sourceID).then(archive => archive.findEntryByID(entryID));
}

export function getFacades() {
    return getVaultManager().then(vaultManager =>
        Promise.all(
            vaultManager.unlockedSources.map(source =>
                getArchive(source.id).then(archive => ({
                    ...createVaultFacade(archive),
                    sourceID: source.id,
                    sourceName: source.name
                }))
            )
        )
    );
}

export function getNameForSource(sourceID) {
    return getVaultManager().then(vaultManager => {
        const source = vaultManager.getSourceForID(sourceID);
        if (!source) {
            throw new Error(`Unable to fetch source information: No source found for ID: ${sourceID}`);
        }
        return source.name;
    });
}

export function getSourceIDForVaultID(vaultID) {
    return getVaultManager().then(vaultManager => {
        const source = vaultManager.unlockedSources.find(source => source.vault.id === vaultID);
        if (!source) {
            throw new Error(`Unable to fetch source information: No source found for vault ID: ${vaultID}`);
        }
        return source.id;
    });
}

export function getSourcesInfo() {
    return getVaultManager().then(vaultManager => {
        return vaultManager.sources.map(source => ({
            id: source.id,
            name: source.name,
            meta: source.meta || {},
            status: source.status,
            order: source.order
        }));
    });
}

export function getUnlockedSourcesCount() {
    return getVaultManager().then(vaultManager => vaultManager.unlockedSources.length);
}

export function lockSource(sourceID) {
    log.info(`Locking source: ${sourceID}`);
    return getVaultManager()
        .then(vaultManager => {
            const source = vaultManager.getSourceForID(sourceID);
            return source.lock();
        })
        .then(updateContextMenu);
}

export function lockSources() {
    log.info("Locking all sources");
    return getVaultManager()
        .then(vaultManager => {
            const { unlockedSources } = vaultManager;
            return unlockedSources.length > 0
                ? Promise.all(unlockedSources.map(source => source.lock()))
                : Promise.resolve();
        })
        .then(updateContextMenu);
}

export function openCredentialsPageForEntry(sourceID, entryID) {
    return getEntry(sourceID, entryID)
        .then(entry => entry.getURLs("login"))
        .then(([loginURL]) => {
            log.info(`Selected to open URL of entry: ${entryID}`);
            if (loginURL) {
                const targetURL = /^https?:\/\//i.test(loginURL) ? loginURL : `https://${loginURL}`;
                log.info(`Opening selected entry URL: ${targetURL}`);
                return createNewTab(targetURL);
            } else {
                log.info("Failed opening entry page: No URL found on entry");
            }
            return null;
        });
}

export function removeSource(sourceID) {
    log.info(`Removing source: ${sourceID}`);
    return getVaultManager()
        .then(vaultManager => {
            return vaultManager.interruptAutoUpdate(() => vaultManager.removeSource(sourceID));
        })
        .then(updateContextMenu);
}

export async function saveSource(sourceID) {
    log.info(`Preparing to save source: ${sourceID}`);
    const vaultManager = await getVaultManager();
    const source = vaultManager.getSourceForID(sourceID);
    if (!source) {
        throw new Error(`Unable to save source: No unlocked source found for ID: ${sourceID}`);
    }
    await vaultManager.interruptAutoUpdate(async () => {
        log.info(`Saving source: ${sourceID}`);
        await source.save();
    });
}

export async function sendCredentialsToTab(sourceID, entryID, signIn) {
    const entry = await getEntry(sourceID, entryID);
    const entryFacade = createEntryFacade(entry);
    const properties = entryFacade.fields.reduce((output, field) => {
        if (field.propertyType !== "property") return output;
        output[field.property] = field.value;
        return output;
    }, {});
    // Get target tab
    const tab = await getCurrentTab();
    // Handle search update (measure loads of an item)
    try {
        const search = await getSearch();
        const vault = await getArchive(sourceID);
        await search.incrementScore(vault.id, entryID, tab.url);
        const vaultManager = await getVaultManager();
        vaultManager.emit("sourcesUpdated");
    } catch (err) {
        console.error("Failed updating search scores", err);
    }
    // Send info to tab
    sendTabMessage(tab.id, {
        type: "enter-details",
        signIn,
        entry: {
            id: entryFacade.id,
            properties
        }
    });
}

function signalMyButtercupTabConnections(vaultID) {
    const tabsQuery = new Promise(resolve => {
        chrome.tabs.query(
            {
                currentWindow: true,
                url: ["http://localhost:8000/*", "https://my.buttercup.pw/*"]
            },
            resolve
        );
    });
    return tabsQuery.then(tabs => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, { type: "check-mybcup-vault", vaultID });
        });
    });
}

export async function unlockSource(sourceID, masterPassword) {
    log.info(`Unlocking source: ${sourceID}`);
    const vaultManager = await getVaultManager();
    const source = vaultManager.getSourceForID(sourceID);
    await source.unlock(Credentials.fromPassword(masterPassword), {
        storeOfflineCopy: false
    });
    updateContextMenu();
}
