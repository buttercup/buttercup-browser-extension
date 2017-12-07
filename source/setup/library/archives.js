import { makeArchiveAdditionRequest } from "./messaging.js";

export function addNextcloudArchive(name, masterPassword, filename, url, username, password, shouldCreate = false) {
    return makeArchiveAdditionRequest({
        type: "nextcloud",
        name,
        masterPassword,
        filename,
        url,
        username,
        password,
        create: shouldCreate
    });
}

export function addOwnCloudArchive(name, masterPassword, filename, url, username, password, shouldCreate = false) {
    return makeArchiveAdditionRequest({
        type: "owncloud",
        name,
        masterPassword,
        filename,
        url,
        username,
        password,
        create: shouldCreate
    });
}

export function addWebDAVArchive(name, masterPassword, filename, url, username, password, shouldCreate = false) {
    return makeArchiveAdditionRequest({
        type: "webdav",
        name,
        masterPassword,
        filename,
        url,
        username,
        password,
        create: shouldCreate
    });
}
