"use strict";

const validation = require("./validate.js");

const Buttercup = window.Buttercup;
const {
    Credentials,
    WebDAVDatasource,
    SharedWorkspace
} = Buttercup;

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

let archives = module.exports = {

    addArchiveByRequest: function(request) {
        switch(request.type) {
            case "webdav": {
                return archives.addWebDAVArchive(request);
                break;
            }

            default:
                throw new Error(`Unknown archive type: ${request.type}`);
        }
    },

    addWebDAVArchive: function(request) {
        return Promise
            .resolve(request)
            .then(validation.validateWebDAVArchive)
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
                return archives
                    .fetchWorkspace(
                        new WebDAVDatasource(
                            request.webdav_address,
                            request.webdav_path,
                            request.webdav_username,
                            request.webdav_password
                        ),
                        request.master_password
                    )
                    .then(validation.validateWorkspace)
                    .then(function(workspace) {
                        return [credentials, workspace];
                    });
            })
            .then(function([credentials, workspace] = []) {
                Buttercup.Web.archiveManager.addArchive(
                    request.name,
                    workspace,
                    credentials,
                    request.master_password
                );
                return Buttercup.Web.archiveManager.saveState();
            });
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
            entry: group.createEntry(title),
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

    mapArchivesToSkeleton: function() {
        let unlockedArchives = Buttercup.Web.archiveManager.unlockedArchives;
        return unlockedArchives.map(item => Object.assign(
            groupToSkeleton(item.workspace.primary.archive),
            {
                name: item.name
            }
        ));
    },

    unlockArchive: function(name, password) {
        return Buttercup.Web.archiveManager.unlock(name, password);
    }

};
