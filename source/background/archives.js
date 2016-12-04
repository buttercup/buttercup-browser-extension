"use strict";

let Buttercup = window.Buttercup;

module.exports = {

    addArchiveByRequest: function(request) {
        let Credentials = window.Buttercup.Credentials;
        // console.log(window.Buttercup, window.Buttercup.Web);
        switch(request.type) {
            case "webdav": {
                let webdavCreds = new Credentials();
                webdavCreds.type = "webdav";
                webdavCreds.username = request.webdav_username;
                webdavCreds.password = request.webdav_password;
                webdavCreds.setMeta("address", request.webdav_address);
                Buttercup.Web.archiveManager.addCredentials(
                    request.name,
                    webdavCreds,
                    request.master_password
                );
                Buttercup.Web.archiveManager.saveState();
                break;
            }

            default:
                throw new Error(`Unknown archive type: ${request.type}`);
        }
    },

    getArchiveList: function() {
        return Buttercup.Web.archiveManager.getCredentialStates();
    }

};
