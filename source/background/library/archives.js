import { Archive, createCredentials, WebDAVDatasource, Workspace } from "buttercup/dist/buttercup-web.min.js";
import { getArchiveManager } from "./buttercup.js";
import log from "../../shared/library/log.js";

export function addArchiveByRequest(payload) {
    switch (payload.type) {
        case "nextcloud":
            return addNextcloudArchive(payload);
        case "owncloud":
            return addOwnCloudArchive(payload);
        case "webdav":
            return addWebDAVArchive(payload);
        default:
            return Promise.reject(new Error(`Unable to add archive: Unknown type: ${payload.type}`));
    }
}

export function addNextcloudArchive(payload) {
    const { name, masterPassword, filename, url, username, password, create } = payload;
    log.info(`Attempting to connect Nextcloud archive '${filename}' from: ${url}`);
    log.info(`New archive will be created for request: ${create}`);
    return getArchiveManager()
        .then(archiveManager => {
            const nextcloudCreds = createCredentials("nextcloud");
            nextcloudCreds.username = username;
            nextcloudCreds.password = password;
            nextcloudCreds.setValue(
                "datasource",
                JSON.stringify({
                    type: "nextcloud",
                    endpoint: url,
                    path: filename
                })
            );
            return [archiveManager, nextcloudCreds, createCredentials.fromPassword(masterPassword)];
        })
        .then(([archiveManager, sourceCredentials, archiveCredentials]) => {
            return archiveManager.addSource(name, sourceCredentials, archiveCredentials, create);
        });
}

export function addOwnCloudArchive(payload) {
    const { name, masterPassword, filename, url, username, password, create } = payload;
    log.info(`Attempting to connect ownCloud archive '${filename}' from: ${url}`);
    log.info(`New archive will be created for request: ${create}`);
    return getArchiveManager()
        .then(archiveManager => {
            const owncloudCreds = createCredentials("owncloud");
            owncloudCreds.username = username;
            owncloudCreds.password = password;
            owncloudCreds.setValue(
                "datasource",
                JSON.stringify({
                    type: "owncloud",
                    endpoint: url,
                    path: filename
                })
            );
            return [archiveManager, owncloudCreds, createCredentials.fromPassword(masterPassword)];
        })
        .then(([archiveManager, sourceCredentials, archiveCredentials]) => {
            return archiveManager.addSource(name, sourceCredentials, archiveCredentials, create);
        });
}

export function addWebDAVArchive(payload) {
    const { name, masterPassword, filename, url, username, password, create } = payload;
    log.info(`Attempting to connect WebDAV archive '${filename}' from: ${url}`);
    log.info(`New archive will be created for request: ${create}`);
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
            return archiveManager.addSource(name, sourceCredentials, archiveCredentials, create);
        });
}

export function unlockSource(sourceID, masterPassword) {
    return getArchiveManager().then(archiveManager => archiveManager.unlock(sourceID, masterPassword));
}
