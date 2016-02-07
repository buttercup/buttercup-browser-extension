define("ArchiveHandler", function() {

	"use strict";

	class ArchiveHandler {

		constructor(state) {
			this._state = state;
		}

		processArchive(details) {
			console.log(details);
			return Promise.resolve(true);
		}

	}

	return ArchiveHandler;

});
