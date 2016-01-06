(function() {

	"use strict";

	//
	// Helpers
	//

	function promptAddArchiveFile() {
		chrome.extension.sendMessage(
			{
				command: "addArchiveFile"
			},
			function(response) {

			}
		);
	}

	function promptAddArchiveType() {
		promptAddArchiveFile();
	}

	//
	// Definitions
	//

	var btnAddArchive = 				document.getElementById("addArchiveButton");

	//
	// Init
	//

	//
	// Listeners
	//

	btnAddArchive.addEventListener("click", promptAddArchiveType);

})();
