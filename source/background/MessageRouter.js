define("MessageRouter", ["ArchiveHandler"], function(ArchiveHandler) {

	"use strict";

	var MessageRouter = function(state) {
		this._state = state;
		this._archiveHandler = new ArchiveHandler(state);
	};

	MessageRouter.prototype.handle = function(request, sender, sendResponse) {
		if (request && request.command) {
			if (request.command === "addArchive") {
				this._archiveHandler
					.processArchive(request)
					.then(function(success) {
						sendResponse({
							success: success
						});
					});
			}
		}
	};

	return MessageRouter;

});
