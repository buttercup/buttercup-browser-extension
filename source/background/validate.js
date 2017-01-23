let validate = {

    archiveNameAvailable: function(name) {
        return Buttercup.Web.archiveManager.archives.hasOwnProperty(name) === false;
    },

    validateArchiveAddition: function(request) {
        console.log("Add archive (validate)", request);
        let { name } = request;
        if (validate.archiveNameAvailable(name) !== true) {
            throw new Error(`Name is already taken: ${name}`);
        }
        validate.validateObjectString(request, "name");
        validate.validateObjectString(request, "master_password");
        switch(request.type) {
            case "dropbox": {
                validate.validateObjectString(request, "dropbox_path");
                validate.validateObjectString(request, "dropbox_token");
                break;
            }

            case "webdav": {
                validate.validateObjectString(request, "webdav_path");
                break;
            }

            case "owncloud": {
                validate.validateObjectString(request, "owncloud_path");
                break;
            }

            default:
                throw new Error(`Unknown archive type: ${request.type}`);
        }
    },

    validateObjectString: function(obj, property) {
        if (!obj[property]) {
            throw new Error(`The value '${property}' must be set`);
        }
        if (typeof obj[property] === "string" && obj[property].trim().length <= 0) {
            throw new Error(`The value '${property}' must not be empty`);
        }
    },

    validateWorkspace: function(workspace) {
        if (!workspace) {
            throw new Error("Workspace is undefined");
        }
        let { archive, datasource, password } = workspace.primary;
        try {
            archive.getGroups();
        } catch (err) {
            throw new Error("Archive is not present or is invalid");
        }
        if (!datasource.load || !datasource.save) {
            throw new Error("Datasource is not present or is invalid");
        }
        return workspace;
    }

};

export default validate;
