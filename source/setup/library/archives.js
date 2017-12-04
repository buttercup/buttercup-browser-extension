import { makeArchiveAdditionRequest } from "./messaging.js";

export function addNextcloudArchive(name, masterPassword, filename, url, username, password) {
    return makeArchiveAdditionRequest({
        type: "nextcloud",
        name,
        masterPassword,
        filename,
        url,
        username,
        password
    });
}

export function addOwnCloudArchive(name, masterPassword, filename, url, username, password) {
    return makeArchiveAdditionRequest({
        type: "owncloud",
        name,
        masterPassword,
        filename,
        url,
        username,
        password
    });
}

export function addWebDAVArchive(name, masterPassword, filename, url, username, password) {
    return makeArchiveAdditionRequest({
        type: "webdav",
        name,
        masterPassword,
        filename,
        url,
        username,
        password
    });
}