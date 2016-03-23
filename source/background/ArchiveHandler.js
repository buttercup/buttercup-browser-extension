define("ArchiveHandler", function() {

	"use strict";

	const Buttercup = window.Buttercup,
		archiveManager = Buttercup.Web.archiveManager;

	class ArchiveHandler {

		constructor(state) {
			this._state = state;
			this._archives = {};
		}

        getNames() {
            let names = [];
            for (var name in this._archives) {
                if (this._archives.hasOwnProperty(name)) {
                    names.push(name);
                }
            }
            return names;
        }

        getUnlockedWorkspaces() {
            return this
                .getNames()
                .map((name) => this._archives[name])
                .filter((archiveDetails) => {
                    return (archiveDetails.workspace);
                })
                .map((details) => details.workspace);
        }

		openArchive(name) {
			let credentialDetails = archiveManager.unlock(name/*, password */),
				credentials = credentialDetails.credentials,
				masterPassword = credentialDetails.password,
				archiveDetails = this._archives[name];
			if (archiveDetails.workspace !== null) {
				return archiveDetails.workspace;
			}
			if (archiveDetails.type === "webdav") {
				let datasource = new Buttercup.WebDAVDatasource(
						credentials.model.get("address"),
						credentials.model.get("path"),
						credentials.model.get("username"),
						credentials.model.get("password")
					),
					workspace = new Buttercup.Workspace();
				// credentials.model.get("path"),
				// credentials.model.get("username"),
				// credentials.model.get("password"), masterPassword);
				return datasource.load(masterPassword)
					.then(function(archive) {
						workspace
							.setArchive(archive)
							.setPassword(masterPassword)
							.setDatasource(datasource);
						archiveDetails.workspace = workspace;
						return archive;
					});
			}
			return Promise.reject(new Error("Unknown type"));
		}

		processArchive(details) {
			let name = "sample entry",
				credentials = new window.Buttercup.Credentials({
					username: details.remote_username,
					password: details.remote_password,
					address: details.remote_address,
					path: details.remote_path
				});
			archiveManager.addCredentials(
				name,
				credentials,
				details.password
			);
			this._archives[name] = {
				type: details.type,
				workspace: null
			};
			return this.openArchive(name);
		}

	}

	return ArchiveHandler;

});
