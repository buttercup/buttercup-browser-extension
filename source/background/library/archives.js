import { Archive, createCredentials, WebDAVDatasource, Workspace } from "buttercup/dist/buttercup-web.min.js";
import { getArchiveManager } from "./buttercup.js";

export function addArchiveByRequest(payload) {
    switch (payload.type) {
        case "webdav":
            return addWebDAVArchive(payload);
        default:
            return Promise.reject(new Error(`Unable to add archive: Unknown type: ${payload.type}`));
    }
}

export function addWebDAVArchive(payload) {
    const { name, masterPassword, filename, url, username, password } = payload;
    return getArchiveManager()
        .then(archiveManager => {
            const webdavCreds = createCredentials("webdav");
            webdavCreds.username = username;
            webdavCreds.password = password;
            webdavCreds.setValue(
                "datasource",
                JSON.stringify({
                    type: "webdav",
                    endpoint: url,
                    path: filename
                })
            );
            return [archiveManager, webdavCreds, createCredentials.fromPassword(masterPassword)];
        })
        .then(([archiveManager, sourceCredentials, archiveCredentials]) => {
            return archiveManager.addSource(name, sourceCredentials, archiveCredentials, false);
        });
}
