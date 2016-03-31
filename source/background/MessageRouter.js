define("MessageRouter", ["ArchiveHandler"], function(ArchiveHandler) {

	"use strict";

    var Buttercup = window.Buttercup;

	var MessageRouter = function(state) {
		this._state = state;
		this._archiveHandler = new ArchiveHandler(state);
	};

	MessageRouter.prototype.handle = function(request, sender, sendResponse) {
		if (request && request.command) {
			if (request.command === "addArchive") {
				this._archiveHandler
					.processArchive(request)
					.then(function(archive) {
						return true;
					})
					.then(function(success) {
						sendResponse({
							success: success
						});
					})
                    .catch(function(err) {
                        sendResponse({
                            success: false
                        });
                        console.error("Failed adding archive:", err);
                    })
			} else if (request.command === "getArchiveNames") {
                sendResponse({
                    names: this._archiveHandler.getNames()
                });
            } else if (request.command === "stashLogin") {
                console.log("req", request, sender);
            } else if (request.command === "getEntriesForURL") {
                var entries = [];
                this._archiveHandler.getUnlockedWorkspaces().forEach(function(workspace) {
                    Buttercup.Web.ArchiveTools.getEntriesForURL(workspace.getArchive(), request.url)
                        .forEach(function(entry) {
                            entries.push(entry);
                        });
                });
                sendResponse({
                    entries: entries
                });
            }
		}
	};

	return MessageRouter;

});
