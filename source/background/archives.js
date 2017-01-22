"use strict";

const validation = require("./validate.js");

const Buttercup = window.Buttercup;
const {
    Archive,
    Credentials,
    WebDAVDatasource,
    OwnCloudDatasource,
    SharedWorkspace
} = Buttercup;
const DropboxDatasource = Buttercup.Web.DropboxDatasource;

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

function validateAndSave(name, workspace, credentials, password) {
    return Promise
        .resolve(workspace)
        .then(validation.validateWorkspace)
        .then(function() {
            Buttercup.Web.archiveManager.addArchive(
                name,
                workspace,
                credentials,
                password
            );
            return Buttercup.Web.archiveManager.saveState();
        });
}

let archives = module.exports = {

    addArchiveByRequest: function(request) {
        return Promise.resolve(request)
            .then(validation.validateArchiveAddition)
            .then(function() {
                switch(request.type) {
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
                let dropboxCreds = new Credentials();
                dropboxCreds.type = "dropbox";
                dropboxCreds.setMeta(Credentials.DATASOURCE_META, JSON.stringify({
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
                    let workspace = new SharedWorkspace();
                    workspace.setPrimaryArchive(
                        Archive.createWithDefaults(),
                        datasource,
                        request.master_password
                    );
                    return workspace
                        .save()
                        .then(() => [workspace, credentials]);
                }
                return archives
                    .fetchWorkspace(
                        datasource,
                        request.master_password
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
                let owncloudCreds = new Credentials();
                owncloudCreds.type = "owncloud";
                owncloudCreds.username = request.owncloud_username;
                owncloudCreds.password = request.owncloud_password;
                owncloudCreds.setMeta(Credentials.DATASOURCE_META, JSON.stringify({
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
                    request.owncloud_username,
                    request.owncloud_password
                );
                if (request.connect === "new") {
                    let workspace = new SharedWorkspace();
                    workspace.setPrimaryArchive(
                        Archive.createWithDefaults(),
                        datasource,
                        request.master_password
                    );
                    return workspace
                        .save()
                        .then(() => [workspace, credentials]);
                }
                return archives
                    .fetchWorkspace(
                        datasource,
                        request.master_password
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
                let webdavCreds = new Credentials();
                webdavCreds.type = "webdav";
                webdavCreds.username = request.webdav_username;
                webdavCreds.password = request.webdav_password;
                webdavCreds.setMeta(Credentials.DATASOURCE_META, JSON.stringify({
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
                    request.webdav_username,
                    request.webdav_password
                );
                if (request.connect === "new") {
                    let workspace = new SharedWorkspace();
                    workspace.setPrimaryArchive(
                        Archive.createWithDefaults(),
                        datasource,
                        request.master_password
                    );
                    return workspace
                        .save()
                        .then(() => [workspace, credentials]);
                }
                return archives
                    .fetchWorkspace(
                        datasource,
                        request.master_password
                    )
                    .then(workspace => [workspace, credentials]);
            })
            .then(([workspace, credentials] = []) =>
                validateAndSave(request.name, workspace, credentials, request.master_password));
    },

    createEntry: function(archiveID, groupID, title) {
        let unlockedArchives = Buttercup.Web.archiveManager.unlockedArchives,
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

    fetchWorkspace: function(datasource, masterPassword) {
        return datasource
            .load(masterPassword)
            .then(function(archive) {
                let workspace = new SharedWorkspace();
                workspace.setPrimaryArchive(archive, datasource, masterPassword);
                return workspace;
            });
    },

    getArchiveList: function() {
        return Buttercup.Web.archiveManager.displayList;
    },

    getEntry: function(archiveID, entryID) {
        let unlockedArchives = Buttercup.Web.archiveManager.unlockedArchives,
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

    getMatchingEntriesForURL: function(url) {
        let unlockedArchives = Buttercup.Web.archiveManager.unlockedArchives,
            entries = [];
        unlockedArchives.forEach(function(archiveItem) {
            let archive = archiveItem.workspace.primary.archive;
            let newEntries = Buttercup.Web.ArchiveTools.getEntriesForURL(archive, url);
            if (newEntries.length > 0) {
                entries = entries.concat(newEntries);
            }
        });
        return entries;
    },

    lockArchive: function(name) {
        return Buttercup.Web.archiveManager.lock(name);
    },

    mapArchivesToSkeleton: function() {
        let unlockedArchives = Buttercup.Web.archiveManager.unlockedArchives;
        return unlockedArchives.map(item => Object.assign(
            groupToSkeleton(item.workspace.primary.archive),
            {
                name: item.name
            }
        ));
    },

    removeArchive: function(name) {
        let removed = Buttercup.Web.archiveManager.removeArchive(name);
        return Buttercup.Web.archiveManager
            .saveState()
            .then(() => removed);
    },

    unlockArchive: function(name, password) {
        return Buttercup.Web.archiveManager.unlock(name, password);
    }

};
