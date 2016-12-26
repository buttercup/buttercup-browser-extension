"use strict";

const archives = require("./archives.js");

const StorageInterface = window.Buttercup.Web.StorageInterface;

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

            case "archives-and-groups": {

                sendResponse({
                    ok: true,
                    archives: []
                });
                break;
            }

            case "get-archive-states": {
                let states = archives.getArchiveList();
                sendResponse(states);
                break;
            }

            case "get-entries-for-url": {
                let matchingEntries = archives
                    .getMatchingEntriesForURL(request.url)
                    .map(entry => ({
                        id: entry.getID(),
                        title: entry.getProperty("title"),
                        archiveID: entry._getArchive().getID()
                    }));
                sendResponse({
                    ok: true,
                    entries: matchingEntries
                })
                break;
            }

            case "get-entry-raw": {
                let entry;
                try {
                    entry = archives.getEntry(request.archiveID, request.entryID);
                } catch (err) {
                    // @todo better way at logging errors
                    // skip
                }
                if (entry) {
                    sendResponse({
                        ok: true,
                        data: entry.toObject()
                    });
                } else {
                    sendResponse({
                        ok: false,
                        error: "No archive/entry found"
                    });
                }
                break;
            }

            case "last-form-submission": {
                sendResponse({
                    ok: true,
                    data: StorageInterface.getData("lastSubmission", false)
                });
                break;
            }

            case "open-add-last-login": {
                chrome.tabs.create({'url': chrome.extension.getURL('setup.html#/addLastLogin')}, function() {});
                break;
            }

            case "save-form-submission": {
                StorageInterface.setData("lastSubmission", request.data);
                break;
            }

            case "unlock-archive": {
                let opts = request.data;
                archives
                    .unlockArchive(opts.name, opts.password)
                    .then(function() {
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

            default:
                // unrecognised command
                break;
        }
        return RESPOND_SYNC;
    });

};
