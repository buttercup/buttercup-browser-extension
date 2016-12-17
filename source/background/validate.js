module.exports = {

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
    },

    validateWebDAVArchive: function(details) {
        return true;
    }

};
