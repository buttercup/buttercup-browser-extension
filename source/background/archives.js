import validation from "./validate.js";

const Buttercup = window.Buttercup;
const {
    Archive,
    createCredentials,
    WebDAVDatasource,
    OwnCloudDatasource,
    Workspace
} = Buttercup;
const {
    DropboxDatasource,
    EntryFinder
} = Buttercup.Web;

function generateEntryPath(entry) {
    let group = entry.getGroup(),
        entryPath = [group];
    let parent;
    while ((parent = group.getGroup()) !== null) {
        entryPath.unshift(parent);
        group = parent;
    }
    return entryPath.map(group => group.getTitle());
}

function getArchiveManager() {
    return Buttercup.Web.ArchiveManager.getSharedManager();
}

function groupToSkeleton(item, isGroup) {
    let subItems = item.getGroups().map(group => groupToSkeleton(group, true));
    if (!isGroup) {
        // archive
        return {
            archiveID: item.getID(),
            groups: subItems
        };
    }
    // group
    return {
        groupID: item.getID(),
        groups: subItems,
        title: item.getTitle()
    };
}

function validateAndSave(name, workspace, storageCredentials, password) {
    const archiveManager = getArchiveManager();
    return Promise
        .resolve(workspace)
        .then(validation.validateWorkspace)
        .then(function() {
            archiveManager.addArchive(
                name,
                workspace,
                storageCredentials,
                password
            );
            return archiveManager.saveState();
        });
}

let archives = {

    addArchiveByRequest: function(request) {
        return Promise.resolve(request)
            .then(validation.validateArchiveAddition)
            .then(function() {
                switch (request.type) {
                    case "webdav": {
                        return archives.addWebDAVArchive(request);
                    }
                    case "dropbox": {
                        return archives.addDropboxArchive(request);
                    }
                    case "owncloud": {
                        return archives.addOwnCloudArchive(request);
                    }

                    default:
                        throw new Error(`Unknown archive type: ${request.type}`);
                }
            });
    },

    addDropboxArchive: function(request) {
        return Promise
            .resolve(request)
            .then(function() {
                let dropboxCreds = createCredentials("dropbox");
                dropboxCreds.setValue("datasource", JSON.stringify({
                    type: "dropbox",
                    token: request.dropbox_token,
                    path: request.dropbox_path
                }));
                return dropboxCreds;
            })
            .then(function(credentials) {
                let datasource = new DropboxDatasource(
                    request.dropbox_token,
                    request.dropbox_path
                );
                if (request.connect === "new") {
                    let workspace = new Workspace();
                    workspace.setPrimaryArchive(
                        Archive.createWithDefaults(),
                        datasource,
                        createCredentials.fromPassword(request.master_password)
                    );
                    return workspace
                        .save()
                        .then(() => [workspace, credentials]);
                }
                return archives
                    .fetchWorkspace(
                        datasource,
                        createCredentials.fromPassword(request.master_password)
                    )
                    .then(workspace => [workspace, credentials]);
            })
            .then(([workspace, credentials] = []) =>
                validateAndSave(request.name, workspace, credentials, request.master_password));
    },

    addOwnCloudArchive: function(request) {
        return Promise
            .resolve(request)
            .then(function() {
                let owncloudCreds = createCredentials("owncloud");
                owncloudCreds.username = request.owncloud_username;
                owncloudCreds.password = request.owncloud_password;
                owncloudCreds.setValue("datasource", JSON.stringify({
                    type: "owncloud",
                    endpoint: request.owncloud_address,
                    path: request.owncloud_path
                }));
                return owncloudCreds;
            })
            .then(function(credentials) {
                let datasource = new OwnCloudDatasource(
                    request.owncloud_address,
                    request.owncloud_path,
                    createCredentials({
                        username: request.owncloud_username,
                        password: request.owncloud_password
                    })
                );
                if (request.connect === "new") {
                    const workspace = new Workspace();
                    workspace.setPrimaryArchive(
                        Archive.createWithDefaults(),
                        datasource,
                        createCredentials.fromPassword(request.master_password)
                    );
                    return workspace
                        .save()
                        .then(() => [workspace, credentials]);
                }
                return archives
                    .fetchWorkspace(
                        datasource,
                        createCredentials.fromPassword(request.master_password)
                    )
                    .then(workspace => [workspace, credentials]);
            })
            .then(([workspace, credentials] = []) =>
                validateAndSave(request.name, workspace, credentials, request.master_password));
    },

    addWebDAVArchive: function(request) {
        return Promise
            .resolve(request)
            .then(function() {
                let webdavCreds = createCredentials("webdav");
                webdavCreds.username = request.webdav_username;
                webdavCreds.password = request.webdav_password;
                webdavCreds.setValue("datasource", JSON.stringify({
                    type: "webdav",
                    endpoint: request.webdav_address,
                    path: request.webdav_path
                }));
                return webdavCreds;
            })
            .then(function(credentials) {
                let datasource = new WebDAVDatasource(
                    request.webdav_address,
                    request.webdav_path,
                    createCredentials({
                        username: request.webdav_username,
                        password: request.webdav_password
                    })
                );
                if (request.connect === "new") {
                    let workspace = new Workspace();
                    workspace.setPrimaryArchive(
                        Archive.createWithDefaults(),
                        datasource,
                        createCredentials.fromPassword(request.master_password)
                    );
                    return workspace
                        .save()
                        .then(() => [workspace, credentials]);
                }
                return archives
                    .fetchWorkspace(
                        datasource,
                        createCredentials.fromPassword(request.master_password)
                    )
                    .then(workspace => [workspace, credentials]);
            })
            .then(([workspace, credentials] = []) =>
                validateAndSave(request.name, workspace, credentials, request.master_password));
    },

    createEntry: function(archiveID, groupID, title) {
        let unlockedArchives = getArchiveManager().unlockedArchives,
            numArchives = unlockedArchives.length,
            archive,
            workspace;
        for (let i = 0; i < numArchives; i += 1) {
            let thisArchive = unlockedArchives[i].workspace.primary.archive;
            if (thisArchive.getID() === archiveID) {
                workspace = unlockedArchives[i].workspace;
                archive = thisArchive;
                break;
            }
        }
        if (!archive) {
            throw new Error(`Failed finding archive with ID: ${archiveID}`);
        }
        let group = archive.findGroupByID(groupID);
        if (!group) {
            throw new Error(`Failed finding group with ID ${groupID}`);
        }
        return {
            workspace,
            entry: group.createEntry(title)
        };
    },

    fetchWorkspace: function(datasource, credentials) {
        return datasource
            .load(credentials)
            .then(function(archive) {
                let workspace = new Workspace();
                workspace.setPrimaryArchive(archive, datasource, credentials);
                return workspace;
            });
    },

    getArchiveList: function() {
        return getArchiveManager().displayList;
    },

    getEntry: function(archiveID, entryID) {
        let unlockedArchives = getArchiveManager().unlockedArchives,
            numArchives = unlockedArchives.length;
        // try archive ID first:
        for (let i = 0; i < numArchives; i += 1) {
            let archive = unlockedArchives[i].workspace.primary.archive,
                thisID = archive.getID();
            if (thisID && thisID === archiveID) {
                return archive.getEntryByID(entryID);
            }
        }
        // fallback to using just entry ID:
        for (let i = 0; i < numArchives; i += 1) {
            let archive = unlockedArchives[i].workspace.primary.archive,
                entry = archive.getEntryByID(entryID);
            if (entry) {
                return entry;
            }
        }
        return null;
    },

    getMatchingEntriesForSearch: function(query) {
        const unlockedArchives = getArchiveManager()
            .unlockedArchives
            .map(item => item.workspace.primary.archive);
        const ef = new EntryFinder(unlockedArchives);
        return ef.search(query).map(res => ({
            entry: res.entry,
            path: generateEntryPath(res.entry),
            archiveName: "Unknown"
        }));
    },

    getMatchingEntriesForURL: function(url) {
        let unlockedArchives = getArchiveManager().unlockedArchives,
            entries = [];
        unlockedArchives.forEach(function(archiveItem) {
            let archive = archiveItem.workspace.primary.archive;
            let newEntries = Buttercup.Web.ArchiveTools.getEntriesForURL(archive, url);
            if (newEntries.length > 0) {
                entries = entries.concat(newEntries.map(entry => ({
                    entry,
                    path: generateEntryPath(entry),
                    archiveName: archiveItem.name
                })));
            }
        });
        return entries;
    },

    getUnlockedArchiveList: function() {
        return getArchiveManager().unlockedArchives;
    },

    lockArchive: function(name) {
        return getArchiveManager().lock(name);
    },

    mapArchivesToSkeleton: function() {
        let unlockedArchives = getArchiveManager().unlockedArchives;
        return unlockedArchives.map(item => Object.assign(
            groupToSkeleton(item.workspace.primary.archive),
            {
                name: item.name
            }
        ));
    },

    removeArchive: function(name) {
        const archiveManager = getArchiveManager();
        let removed = archiveManager.removeArchive(name);
        return archiveManager
            .saveState()
            .then(() => removed);
    },

    unlockArchive: function(name, password) {
        return getArchiveManager().unlock(name, password);
    }

};

export function updateAll() {
    return getArchiveManager().updateUnlocked();
}

export default archives;
