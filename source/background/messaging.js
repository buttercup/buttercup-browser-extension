"use strict";

const archives = require("./archives.js");

module.exports = function addListeners() {

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        switch(request.command) {
            case "add-archive": {
                let archiveData = request.data;
                console.log("Add archive", archiveData);
                archives.addArchiveByRequest(archiveData);
                sendResponse({
                    ok: true
                });
                break;
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
    });

};
