import extractDomain from "extract-domain";
import {
    Archive,
    createCredentials,
    EntryFinder,
    WebDAVDatasource,
    Workspace,
    Group
} from "buttercup/dist/buttercup-web.js";
import { getArchiveManager } from "./buttercup.js";
import log from "../../shared/library/log.js";
import { getCurrentTab, sendTabMessage } from "../../shared/library/extension.js";

export function addArchiveByRequest(payload) {
    switch (payload.type) {
        case "dropbox":
            return addDropboxArchive(payload);
        case "nextcloud":
            return addNextcloudArchive(payload);
        case "owncloud":
            return addOwnCloudArchive(payload);
        case "webdav":
            return addWebDAVArchive(payload);
        default:
            return Promise.reject(new Error(`Unable to add archive: Unknown type: ${payload.type}`));
    }
}

export function addDropboxArchive(payload) {
    const { name, masterPassword, filename, dropboxToken, create } = payload;
    log.info(`Attempting to connect Dropbox archive '${filename}'`);
    log.info(`New archive will be created for request: ${create}`);
    return getArchiveManager()
        .then(archiveManager => {
            const dropboxCreds = createCredentials("dropbox");
            dropboxCreds.setValue(
                "datasource",
                JSON.stringify({
                    type: "dropbox",
                    token: dropboxToken,
                    path: filename
                })
            );
            return [archiveManager, dropboxCreds, createCredentials.fromPassword(masterPassword)];
        })
        .then(([archiveManager, sourceCredentials, archiveCredentials]) => {
            return archiveManager.addSource(name, sourceCredentials, archiveCredentials, create);
        });
}

export function addNextcloudArchive(payload) {
    const { name, masterPassword, filename, url, username, password, create } = payload;
    log.info(`Attempting to connect Nextcloud archive '${filename}' from: ${url}`);
    log.info(`New archive will be created for request: ${create}`);
    return getArchiveManager()
        .then(archiveManager => {
            const nextcloudCreds = createCredentials("nextcloud");
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
            return [archiveManager, nextcloudCreds, createCredentials.fromPassword(masterPassword)];
        })
        .then(([archiveManager, sourceCredentials, archiveCredentials]) => {
            return archiveManager.addSource(name, sourceCredentials, archiveCredentials, create);
        });
}

export function addOwnCloudArchive(payload) {
    const { name, masterPassword, filename, url, username, password, create } = payload;
    log.info(`Attempting to connect ownCloud archive '${filename}' from: ${url}`);
    log.info(`New archive will be created for request: ${create}`);
    return getArchiveManager()
        .then(archiveManager => {
            const owncloudCreds = createCredentials("owncloud");
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
            return [archiveManager, owncloudCreds, createCredentials.fromPassword(masterPassword)];
        })
        .then(([archiveManager, sourceCredentials, archiveCredentials]) => {
            return archiveManager.addSource(name, sourceCredentials, archiveCredentials, create);
        });
}

export function addWebDAVArchive(payload) {
    const { name, masterPassword, filename, url, username, password, create } = payload;
    log.info(`Attempting to connect WebDAV archive '${filename}' from: ${url}`);
    log.info(`New archive will be created for request: ${create}`);
    return getArchiveManager()
        .then(archiveManager => {
            const webdavCreds = createCredentials("webdav");
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
            return [archiveManager, webdavCreds, createCredentials.fromPassword(masterPassword)];
        })
        .then(([archiveManager, sourceCredentials, archiveCredentials]) => {
            return archiveManager.addSource(name, sourceCredentials, archiveCredentials, create);
        });
}

export function archiveToObjectGroupsOnly(archive) {
    return archive.toObject(Group.OutputFlag.Groups);
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
        const sourceIndex = archiveManager.indexOfSource(sourceID);
        const source = archiveManager.sources[sourceIndex];
        if (!source) {
            throw new Error(`Unable to fetch archive: No source found for ID: ${sourceID}`);
        }
        if (source.status !== "unlocked") {
            throw new Error(
                `Unable fetch archive: Invalid source state (should be unlocked: ${sourceID}): ${source.status}`
            );
        }
        return source.workspace.primary.archive;
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
                [next.workspace.primary.archive.getID()]: next.id
            }),
            {}
        );
        const archives = unlockedSources.map(source => source.workspace.primary.archive);
        const finder = new EntryFinder(archives);
        return finder.search(term).map(result => ({
            entry: result.entry,
            sourceID: lookup[result.archive.getID()]
        }));
    });
}

export function getMatchingEntriesForURL(url) {
    return getArchiveManager().then(archiveManager => {
        const unlockedSources = archiveManager.unlockedSources;
        const entries = [];
        unlockedSources.forEach(source => {
            const archive = source.workspace.primary.archive;
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
        const sourceIndex = archiveManager.indexOfSource(sourceID);
        const source = archiveManager.sources[sourceIndex];
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
    return getArchiveManager().then(archiveManager => archiveManager.lock(sourceID));
}

export function lockSources() {
    log.info("Locking all sources");
    return getArchiveManager().then(archiveManager => {
        const { unlockedSources } = archiveManager;
        return unlockedSources.length > 0
            ? Promise.all(unlockedSources.map(source => archiveManager.lock(source.id)))
            : Promise.resolve();
    });
}

export function removeSource(sourceID) {
    log.info(`Removing source: ${sourceID}`);
    return getArchiveManager().then(archiveManager => archiveManager.remove(sourceID));
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
    return getArchiveManager().then(archiveManager => archiveManager.unlock(sourceID, masterPassword));
}
