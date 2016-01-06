define("ArchiveHandler", function() {

	"use strict";

	var ArchiveHandler = function(state) {
		this._state = state;
	};

	ArchiveHandler.prototype.promptForFileArchive = function() {
		chrome.fileSystem.chooseEntry(
			{
				type: "openWritableFile"
			},
			function() {
				console.log(arguments);
			}
		);
	};

	return ArchiveHandler;

});
