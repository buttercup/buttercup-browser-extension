import extractDomain from "extract-domain";
import {
    Archive,
    ArchiveSource,
    Credentials,
    Datasources,
    EntryFinder,
    Workspace,
    Group
} from "../../shared/library/buttercup.js";
import { getArchiveManager } from "./buttercup.js";
import { getState } from "../redux/index.js";
import { getConfigKey } from "../../shared/selectors/app.js";
import "../../shared/library/LocalFileDatasource.js";
import log from "../../shared/library/log.js";
import { MYBUTTERCUP_CLIENT_ID, MYBUTTERCUP_CLIENT_SECRET } from "../../shared/library/myButtercup.js";
import { createNewTab, getCurrentTab, getExtensionURL, sendTabMessage } from "../../shared/library/extension.js";

const { WebDAVDatasource } = Datasources;

export function addArchiveByRequest(payload) {
    switch (payload.type) {
        case "dropbox":
            return addDropboxArchive(payload);
        case "googledrive":
            return addGoogleDriveArchive(payload);
        case "nextcloud":
            return addNextcloudArchive(payload);
        case "owncloud":
            return addOwnCloudArchive(payload);
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
    return getArchiveManager()
        .then(archiveManager => {
            const dropboxCreds = new Credentials("dropbox");
            dropboxCreds.setValue(
                "datasource",
                JSON.stringify({
                    type: "dropbox",
                    token: dropboxToken,
                    path: filename
                })
            );
            return Promise.all([
                dropboxCreds.toSecureString(masterPassword),
                Credentials.fromPassword(masterPassword).toSecureString(masterPassword)
            ]).then(([sourceCreds, archiveCreds]) => [archiveManager, sourceCreds, archiveCreds]);
        })
        .then(([archiveManager, sourceCredentials, archiveCredentials]) => {
            const source = new ArchiveSource(name, sourceCredentials, archiveCredentials, { type: "dropbox" });
            return archiveManager.interruptAutoUpdate(() =>
                archiveManager
                    .addSource(source)
                    .then(() => source.unlock(masterPassword, create))
                    .then(() => archiveManager.dehydrateSource(source))
            );
        });
}

export function addGoogleDriveArchive(payload) {
    const { name, masterPassword, fileID, googleDriveToken, googleDriveRefreshToken, create } = payload;
    log.info(`Attempting to connect Google Drive archive '${fileID}' (${name})`);
    log.info(`New archive will be created for request: ${create}`);
    return getArchiveManager()
        .then(archiveManager => {
            const googleCreds = new Credentials("googledrive");
            googleCreds.setValue(
                "datasource",
                JSON.stringify({
                    type: "googledrive",
                    token: googleDriveToken,
                    refreshToken: googleDriveRefreshToken,
                    fileID
                })
            );
            return Promise.all([
                googleCreds.toSecureString(masterPassword),
                Credentials.fromPassword(masterPassword).toSecureString(masterPassword)
            ]).then(([sourceCreds, archiveCreds]) => [archiveManager, sourceCreds, archiveCreds]);
        })
        .then(([archiveManager, sourceCredentials, archiveCredentials]) => {
            const source = new ArchiveSource(name, sourceCredentials, archiveCredentials, { type: "googledrive" });
            return archiveManager.interruptAutoUpdate(() =>
                archiveManager
                    .addSource(source)
                    .then(() => source.unlock(masterPassword, create))
                    .then(() => archiveManager.dehydrateSource(source))
            );
        });
}

export function addLocalArchive(payload) {
    const { name, masterPassword, filename, key, create } = payload;
    log.info(`Attempting to connect local archive '${filename}' (${name})`);
    log.info(`New archive will be created for request: ${create}`);
    return getArchiveManager()
        .then(archiveManager => {
            const localCreds = new Credentials("localfile");
            localCreds.setValue(
                "datasource",
                JSON.stringify({
                    type: "localfile",
                    path: filename,
                    token: key
                })
            );
            return Promise.all([
                localCreds.toSecureString(masterPassword),
                Credentials.fromPassword(masterPassword).toSecureString(masterPassword)
            ]).then(([sourceCreds, archiveCreds]) => [archiveManager, sourceCreds, archiveCreds]);
        })
        .then(([archiveManager, sourceCredentials, archiveCredentials]) => {
            const source = new ArchiveSource(name, sourceCredentials, archiveCredentials, { type: "localfile" });
            return archiveManager.interruptAutoUpdate(() =>
                archiveManager
                    .addSource(source)
                    .then(() => source.unlock(masterPassword, create))
                    .then(() => archiveManager.dehydrateSource(source))
            );
        });
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
                entry.setMeta("URL", url);
            }
        })
        .then(() => saveSource(sourceID));
}

export function addMyButtercupArchive(payload) {
    const { masterPassword, accessToken, refreshToken, vaultID } = payload;
    log.info("Attempting to connect My Buttercup vault");
    return getArchiveManager().then(archiveManager => {
        const myBcupCreds = new Credentials("mybuttercup");
        myBcupCreds.setValue("datasource", {
            type: "mybuttercup",
            accessToken,
            refreshToken,
            clientID: MYBUTTERCUP_CLIENT_ID,
            clientSecret: MYBUTTERCUP_CLIENT_SECRET,
            vaultID
        });
        return Promise.all([
            myBcupCreds.toSecureString(masterPassword),
            Credentials.fromPassword(masterPassword).toSecureString(masterPassword)
        ]).then(([sourceCreds, archiveCreds]) => {
            const source = new ArchiveSource("Test MyBcup Name", sourceCreds, archiveCreds, {
                meta: {
                    vaultID
                }
            });
            return archiveManager.addSource(source).then(() => source.unlock(masterPassword));
        });
    });
}

export function addNextcloudArchive(payload) {
    const { name, masterPassword, filename, url, username, password, create } = payload;
    log.info(`Attempting to connect Nextcloud archive '${filename}' from: ${url} (${name})`);
    log.info(`New archive will be created for request: ${create}`);
    return getArchiveManager()
        .then(archiveManager => {
            const nextcloudCreds = new Credentials("nextcloud");
            nextcloudCreds.username = username;
            nextcloudCreds.password = password;
            nextcloudCreds.setValue(
                "datasource",
                JSON.stringify({
                    type: "nextcloud",
                    endpoint: url,
                    path: filename
                })
            );
            return Promise.all([
                nextcloudCreds.toSecureString(masterPassword),
                Credentials.fromPassword(masterPassword).toSecureString(masterPassword)
            ]).then(([sourceCreds, archiveCreds]) => [archiveManager, sourceCreds, archiveCreds]);
        })
        .then(([archiveManager, sourceCredentials, archiveCredentials]) => {
            const source = new ArchiveSource(name, sourceCredentials, archiveCredentials, { type: "nextcloud" });
            return archiveManager.interruptAutoUpdate(() =>
                archiveManager
                    .addSource(source)
                    .then(() => source.unlock(masterPassword, create))
                    .then(() => archiveManager.dehydrateSource(source))
            );
        });
}

export function addOwnCloudArchive(payload) {
    const { name, masterPassword, filename, url, username, password, create } = payload;
    log.info(`Attempting to connect ownCloud archive '${filename}' from: ${url} (${name})`);
    log.info(`New archive will be created for request: ${create}`);
    return getArchiveManager()
        .then(archiveManager => {
            const owncloudCreds = new Credentials("owncloud");
            owncloudCreds.username = username;
            owncloudCreds.password = password;
            owncloudCreds.setValue(
                "datasource",
                JSON.stringify({
                    type: "owncloud",
                    endpoint: url,
                    path: filename
                })
            );
            return Promise.all([
                owncloudCreds.toSecureString(masterPassword),
                Credentials.fromPassword(masterPassword).toSecureString(masterPassword)
            ]).then(([sourceCreds, archiveCreds]) => [archiveManager, sourceCreds, archiveCreds]);
        })
        .then(([archiveManager, sourceCredentials, archiveCredentials]) => {
            const source = new ArchiveSource(name, sourceCredentials, archiveCredentials, { type: "owncloud" });
            return archiveManager.interruptAutoUpdate(() =>
                archiveManager
                    .addSource(source)
                    .then(() => source.unlock(masterPassword, create))
                    .then(() => archiveManager.dehydrateSource(source))
            );
        });
}

export function addWebDAVArchive(payload) {
    const { name, masterPassword, filename, url, username, password, create } = payload;
    log.info(`Attempting to connect WebDAV archive '${filename}' from: ${url} (${name})`);
    log.info(`New archive will be created for request: ${create}`);
    return getArchiveManager()
        .then(archiveManager => {
            const webdavCreds = new Credentials("webdav");
            webdavCreds.username = username;
            webdavCreds.password = password;
            webdavCreds.setValue(
                "datasource",
                JSON.stringify({
                    type: "webdav",
                    endpoint: url,
                    path: filename
                })
            );
            return Promise.all([
                webdavCreds.toSecureString(masterPassword),
                Credentials.fromPassword(masterPassword).toSecureString(masterPassword)
            ]).then(([sourceCreds, archiveCreds]) => [archiveManager, sourceCreds, archiveCreds]);
        })
        .then(([archiveManager, sourceCredentials, archiveCredentials]) => {
            const source = new ArchiveSource(name, sourceCredentials, archiveCredentials, { type: "webdav" });
            return archiveManager.interruptAutoUpdate(() =>
                archiveManager
                    .addSource(source)
                    .then(() => source.unlock(masterPassword, create))
                    .then(() => archiveManager.dehydrateSource(source))
            );
        });
}

export function archiveToObjectGroupsOnly(archive) {
    return archive.toObject(Group.OutputFlag.Groups);
}

export function checkUnlockPossibility() {
    const canAutoUnlock = getConfigKey(getState(), "autoUnlockVaults");
    if (!canAutoUnlock) {
        return Promise.resolve();
    }
    return getArchiveManager().then(archiveManager => {
        if (archiveManager.sources.length > 0) {
            createNewTab(getExtensionURL("setup.html#/unlock"));
        }
    });
}

export function generateEntryPath(entry) {
    let group = entry.getGroup(),
        entryPath = [group];
    let parent;
    while ((parent = group.getGroup()) !== null) {
        entryPath.unshift(parent);
        group = parent;
    }
    return entryPath.map(pathGroup => pathGroup.getTitle());
}

export function getArchive(sourceID) {
    return getArchiveManager().then(archiveManager => {
        const source = archiveManager.getSourceForID(sourceID);
        if (!source) {
            throw new Error(`Unable to fetch archive: No source found for ID: ${sourceID}`);
        }
        if (source.status !== "unlocked") {
            throw new Error(
                `Unable fetch archive: Invalid source state (should be unlocked: ${sourceID}): ${source.status}`
            );
        }
        return source.workspace.archive;
    });
}

export function getEntry(sourceID, entryID) {
    return getArchive(sourceID).then(archive => archive.findEntryByID(entryID));
}

export function getMatchingEntriesForSearchTerm(term) {
    return getArchiveManager().then(archiveManager => {
        const unlockedSources = archiveManager.unlockedSources;
        const lookup = unlockedSources.reduce(
            (current, next) => ({
                ...current,
                [next.workspace.archive.id]: next.id
            }),
            {}
        );
        const archives = unlockedSources.map(source => source.workspace.archive);
        const finder = new EntryFinder(archives);
        return finder.search(term).map(result => ({
            entry: result.entry,
            sourceID: lookup[result.archive.id]
        }));
    });
}

export function getMatchingEntriesForURL(url) {
    return getArchiveManager().then(archiveManager => {
        const unlockedSources = archiveManager.unlockedSources;
        const entries = [];
        unlockedSources.forEach(source => {
            const archive = source.workspace.archive;
            const newEntries = archive.findEntriesByMeta("url", /.+/).filter(entry => {
                const entryURL = entry.getMeta("url");
                const entryDomain = extractDomain(entryURL);
                return entryDomain.length > 0 && entryDomain === extractDomain(url) && entry.isInTrash() === false;
            });
            entries.push(
                ...newEntries.map(entry => ({
                    entry,
                    sourceID: source.id
                }))
            );
        });
        return entries;
    });
}

export function getNameForSource(sourceID) {
    return getArchiveManager().then(archiveManager => {
        const source = archiveManager.getSourceForID(sourceID);
        if (!source) {
            throw new Error(`Unable to fetch source information: No source found for ID: ${sourceID}`);
        }
        return source.name;
    });
}

export function getUnlockedSourcesCount() {
    return getArchiveManager().then(archiveManager => archiveManager.unlockedSources.length);
}

export function lockSource(sourceID) {
    log.info(`Locking source: ${sourceID}`);
    return getArchiveManager().then(archiveManager => {
        const source = archiveManager.getSourceForID(sourceID);
        return source.lock();
    });
}

export function lockSources() {
    log.info("Locking all sources");
    return getArchiveManager().then(archiveManager => {
        const { unlockedSources } = archiveManager;
        return unlockedSources.length > 0
            ? Promise.all(unlockedSources.map(source => source.lock()))
            : Promise.resolve();
    });
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
    return getArchiveManager().then(archiveManager => {
        return archiveManager.interruptAutoUpdate(() => archiveManager.removeSource(sourceID));
    });
}

export function saveSource(sourceID) {
    log.info(`Preparing to save source: ${sourceID}`);
    return getArchiveManager().then(archiveManager => {
        const source = archiveManager.getSourceForID(sourceID);
        if (!source) {
            throw new Error(`Unable to save source: No unlocked source found for ID: ${sourceID}`);
        }
        const { workspace } = source;
        return archiveManager.interruptAutoUpdate(() =>
            workspace
                .localDiffersFromRemote()
                .then(differs => {
                    if (differs) {
                        log.info(` -> Remote source differs, will merge before save: ${sourceID}`);
                    } else {
                        log.info(` -> Remote source is the same, no merge/save necessary: ${sourceID}`);
                    }
                    return differs ? workspace.mergeFromRemote().then(() => true) : false;
                })
                .then(shouldSave => {
                    // (shouldSave ? workspace.save() : null)
                    if (!shouldSave) {
                        return null;
                    }
                    return workspace.save().then(() => {
                        log.info(` -> Saved source: ${sourceID}`);
                    });
                })
        );
    });
}

export function sendCredentialsToTab(sourceID, entryID, signIn) {
    return getEntry(sourceID, entryID)
        .then(entry => entry.toObject())
        .then(entryData => {
            return getCurrentTab().then(tab => {
                return sendTabMessage(tab.id, {
                    type: "enter-details",
                    signIn,
                    entry: entryData
                });
            });
        });
}

export function unlockSource(sourceID, masterPassword) {
    log.info(`Unlocking source: ${sourceID}`);
    return getArchiveManager().then(archiveManager =>
        archiveManager
            .getSourceForID(sourceID)
            .unlock(
                masterPassword,
                /* init remote: */ false,
                /* content override: */ null,
                /* store offline content: */ false
            )
    );
}
