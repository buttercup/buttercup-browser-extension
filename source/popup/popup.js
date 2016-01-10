//(function() {
require(["jadeRuntime"], function(JadeRuntime) {

	"use strict";

	//
	// Helpers
	//

	function buildAddArchivePage() {
		var container = document.querySelector("#addArchive div.addMenu");
		return (new Promise(function(resolve, reject) {
			require(["templates/add-archive"], function(addArchive) {
				(resolve)(addArchive({
					bob: "INSERTEDDDD"
				}));
			});
		})).then(function(content) {
			container.innerHTML = content;
		});
	}

	function showPage(pageSlug) {
		pages.forEach(function(page) {
			document.getElementById(page.id).style.display = (page.slug === pageSlug) ?
				"block" : "none";
		});
	}

	//
	// Definitions
	//

	var btnAddArchive = 				document.getElementById("addArchiveButton"),
		pages = 						[
											{
												"id": "archives",
												"slug": "archives"
											},
											{
												"id": "addArchive",
												"slug": "add-archive"
											}
										];

	//
	// Init
	//

	//
	// Listeners
	//

	btnAddArchive.addEventListener("click", function() {
		buildAddArchivePage()
			.then(function() {
				showPage("add-archive");
			});
	});

});
