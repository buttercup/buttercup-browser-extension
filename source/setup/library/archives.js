import { makeArchiveAdditionRequest } from "./messaging.js";

export function addDropboxArchive(name, masterPassword, filename, dropboxToken, shouldCreate = false) {
    return makeArchiveAdditionRequest({
        type: "dropbox",
        name,
        masterPassword,
        filename,
        dropboxToken,
        create: shouldCreate
    });
}

export function addGoogleDriveArchive(
    name,
    masterPassword,
    fileID,
    googleDriveToken,
    googleDriveRefreshToken,
    shouldCreate = false
) {
    return makeArchiveAdditionRequest({
        type: "googledrive",
        name,
        masterPassword,
        fileID,
        googleDriveToken,
        googleDriveRefreshToken,
        create: shouldCreate
    });
}

export function addLocalArchive(name, masterPassword, filename, key, shouldCreate = false) {
    return makeArchiveAdditionRequest({
        type: "localfile",
        name,
        masterPassword,
        filename,
        key,
        create: shouldCreate
    });
}

export function addMyButtercupArchives(name, vaultID, accessToken, refreshToken, masterPassword) {
    return makeArchiveAdditionRequest({
        type: "mybuttercup",
        name,
        accessToken,
        refreshToken,
        masterPassword,
        vaultID
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
