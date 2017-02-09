import archives from "./archives";
import dropbox from "./dropboxToken";
import DropboxAuthenticator from "./DropboxAuthenticator";

const StorageInterface = window.Buttercup.Web.StorageInterface;

const RESPOND_ASYNC = true;
const RESPOND_SYNC = false;

function getEntriesForURL(url) {
    let matchingEntries = archives
        .getMatchingEntriesForURL(url)
        .map(entry => ({
            id: entry.getID(),
            title: entry.getProperty("title"),
            archiveID: entry._getArchive().getID()
        }));
    return matchingEntries;
}

export default function addListeners() {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        switch (request.command) {

            case "add-archive": {
                let archiveData = request.data;
                archives
                    .addArchiveByRequest(archiveData)
                    .then(function() {
                        sendResponse({
                            ok: true
                        });
                    })
                    .catch(function(err) {
                        sendResponse({
                            ok: false,
                            error: err.message
                        });
                    });
                return RESPOND_ASYNC;
            }

            case "archives-and-groups": {
                let items = [];
                try {
                    items = archives.mapArchivesToSkeleton();
                } catch (err) {
                    sendResponse({
                        ok: false,
                        error: err.message
                    });
                    break;
                }
                sendResponse({
                    ok: true,
                    archives: items
                });
                break;
            }

            case "authenticate-dropbox": {
                let dba = new DropboxAuthenticator();
                dba.authenticate()
                    .then(function() {
                        sendResponse({
                            ok: true,
                            token: dba.token
                        });
                    })
                    .catch(function(err) {
                        sendResponse({
                            ok: false,
                            error: err.message
                        });
                    });
                return RESPOND_ASYNC;
            }

            case "close-tab": {
                chrome.tabs.remove(sender.tab.id);
                break;
            }

            case "get-archive-states": {
                let states = archives.getArchiveList();
                sendResponse(states);
                break;
            }

            case "get-entries-for-url": {
                let matchingEntries = getEntriesForURL(request.url);
                sendResponse({
                    ok: true,
                    entries: matchingEntries
                });
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
                let archivesCount = archives.getUnlockedArchiveList().length;
                sendResponse({
                    ok: archivesCount > 0,
                    data: StorageInterface.getData("lastSubmission", false)
                });
                break;
            }

            case "lock-archive": {
                archives
                    .lockArchive(request.name)
                    .then(function() {
                        sendResponse({
                            ok: true
                        });
                    })
                    .catch(function(err) {
                        sendResponse({
                            ok: false,
                            error: err.message
                        });
                    });
                return RESPOND_ASYNC;
            }

            case "open-add-last-login": {
                chrome.tabs.create({ url: chrome.extension.getURL("setup.html#/addLastLogin")}, function() {});
                break;
            }

            case "remove-archive": {
                archives
                    .removeArchive(request.name)
                    .then(function(removed) {
                        if (removed) {
                            sendResponse({
                                ok: true
                            });
                        } else {
                            sendResponse({
                                ok: false,
                                error: "Unable to remove (possibly not found)"
                            });
                        }
                    });
                return RESPOND_ASYNC;
            }

            case "save-form-submission": {
                let matchingEntries = getEntriesForURL(request.data.url);
                if (matchingEntries <= 0) {
                    StorageInterface.setData("lastSubmission", request.data);
                }
                break;
            }

            case "save-new-entry": {
                let data = request.data,
                    workspace,
                    entry;
                try {
                    let result = archives.createEntry(
                        data.archiveID,
                        data.groupID,
                        data.title
                    );
                    workspace = result.workspace;
                    entry = result.entry;
                } catch (err) {
                    sendResponse({
                        ok: false,
                        error: err.message
                    });
                    return RESPOND_SYNC;
                }
                entry
                    .setProperty("username", data.username)
                    .setProperty("password", data.password)
                    .setMeta("URL", data.url)
                    .setMeta("LoginURL", data.loginURL);
                workspace
                    .save()
                    .then(function() {
                        sendResponse({
                            ok: true
                        });
                    })
                    .catch(function(err) {
                        sendResponse({
                            ok: false,
                            error: err.message
                        });
                    });
                return RESPOND_ASYNC;
            }

            case "set-dropbox-token": {
                dropbox.setToken(request.token);
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
}
