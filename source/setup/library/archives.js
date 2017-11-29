import { makeArchiveAdditionRequest } from "./messaging.js";

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
