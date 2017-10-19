let validate = {

    archiveNameAvailable: function(name) {
        return Buttercup.Web.ArchiveManager.getSharedManager().archives.hasOwnProperty(name) === false;
    },

    validateArchiveAddition: function(request) {
        let { name } = request;
        if (validate.archiveNameAvailable(name) !== true) {
            throw new Error(`Name is already taken: ${name}`);
        }
        validate.validateObjectString(request, "name");
        validate.validateObjectString(request, "masterPassword");
        switch (request.type) {
            case "dropbox": {
                validate.validateObjectString(request, "dropboxPath");
                validate.validateObjectString(request, "dropboxToken");
                break;
            }

            case "webdav": {
                validate.validateObjectString(request, "webdavPath");
                break;
            }

            case "owncloud": {
                validate.validateObjectString(request, "owncloudPath");
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
        let { archive, datasource /* , password */ } = workspace.primary;
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
