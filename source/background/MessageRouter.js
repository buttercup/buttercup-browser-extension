define("MessageRouter", ["ArchiveHandler"], function(ArchiveHandler) {

	"use strict";

	var MessageRouter = function(state) {
		this._state = state;
		this._archiveHandler = new ArchiveHandler(state);
	};

	MessageRouter.prototype.handle = function(request, sender, sendResponse) {
		if (request && request.command) {
			if (request.command === "addArchiveFile") {
				console.log("ADDD"),
				this._archiveHandler.promptForFileArchive();
			}
		}
	};

	return MessageRouter;

});