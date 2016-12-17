"use strict";

const archives = require("./archives.js");

const RESPOND_ASYNC = true;
const RESPOND_SYNC = false;

module.exports = function addListeners() {

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        switch(request.command) {
            case "add-archive": {
                let archiveData = request.data;
                console.log("Add archive", archiveData);
                archives
                    .addArchiveByRequest(archiveData)
                    .then(function(result) {
                        sendResponse({
                            ok: true
                        });
                    })
                    .catch(function(err) {
                        console.error(err);
                        sendResponse({
                            ok: false,
                            error: err.message
                        });
                    });
                return RESPOND_ASYNC;
            }

            case "get-archive-states": {
                let states = archives.getArchiveList();
                console.log("Get archives", states);
                sendResponse(states);
                break;
            }

            default:
                // unrecognised command
                break;
        }
        return RESPOND_SYNC;
    });

};
