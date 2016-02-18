define("ArchiveHandler", function() {

	"use strict";

	const Buttercup = window.Buttercup,
		archiveManager = Buttercup.Web.archiveManager;

	class ArchiveHandler {

		constructor(state) {
			this._state = state;
			this._archives = {};
		}

		openArchive(name) {
			let credentials = archiveManager.getCredentials(name),
				archiveDetails = this._archives[name];
			if (archiveDetails.type === "webdav") {
				let datasource = new Buttercup.WebDAVDatasource(
					credentials.model.get("address"),
					"/test.bcup",
					credentials.model.get("username"),
					credentials.model.get("password")
				);
			}
			return Promise.reject(new Error("Unknown type"));
		}

		processArchive(details) {
			let name = "sample entry",
				credentials = new window.Buttercup.Credentials({
					username: details.remote_username,
					password: details.remote_password,
					address: details.remote_address
				});
			archiveManager.addCredentials(
				name,
				credentials,
				details.password
			);
			this._archives[name] = {
				type: details.type
			};
			return this.openArchive(name);
		}

	}

	return ArchiveHandler;

});
