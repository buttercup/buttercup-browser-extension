"use strict";

const validation = require("./validate.js");

const Buttercup = window.Buttercup;
const {
    Credentials,
    WebDAVDatasource,
    SharedWorkspace
} = Buttercup;

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
                webdavCreds.setMeta("address", request.webdav_address);
                webdavCreds.setMeta("path", request.webdav_path);
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
                console.log(credentials, workspace);
                Buttercup.Web.archiveManager.addCredentials(
                    request.name,
                    credentials,
                    request.master_password
                );
                Buttercup.Web.archiveManager.saveState();
            });
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
        return Buttercup.Web.archiveManager.getCredentialStates();
    },

    unlockArchive: function(name, password) {
        return Buttercup.Web.archiveManager.unlock(name, password);
    }

};