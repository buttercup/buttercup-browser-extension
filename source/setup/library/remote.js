import createWebDAVClient, { setFetchMethod } from "webdav";
import createDropboxFSClient from "dropbox-fs";
import joinPath from "path.join";
import pify from "pify";
import log from "../../shared/library/log.js";
import { getState } from "../redux/index.js";
import { getAuthToken as getDropboxAuthToken } from "../../shared/selectors/dropbox.js";

setFetchMethod(window.fetch);

let __webdavClient = null,
    __dropboxFSClient = null;

export function connectWebDAV(url, username, password) {
    const client = createWebDAVClient(url, username, password);
    log.info(`Creating WebDAV connection to: ${url}`);
    return testWebDAVConnection(client).then(succeeded => {
        if (succeeded) {
            log.info("Connection to WebDAV service succeeded");
            __webdavClient = client;
            return;
        }
        log.error(`Failed establishing WebDAV connection: ${url}`);
        throw new Error(`Connection failed to WebDAV service: ${url}`);
    });
}

export function disposeWebDAVConnection() {
    __webdavClient = null;
}

export function getDropboxFSClient() {
    if (!__dropboxFSClient) {
        const state = getState();
        const authToken = getDropboxAuthToken(state);
        if (!authToken) {
            throw new Error("Unable to create Dropbox-fs client: No token found");
        }
        __dropboxFSClient = createDropboxFSClient({
            apiKey: authToken
        });
    }
    return __dropboxFSClient;
}

export function getDropboxDirectoryContents(directory, dropboxClient = getDropboxFSClient()) {
    const readDir = pify(::dropboxClient.readdir);
    const stat = pify(::dropboxClient.stat);
    return readDir(directory)
        .then(contents => Promise.all(contents.map(item => stat(joinPath(directory, item)))))
        .then(contents =>
            contents.map(item => ({
                filename: item.path_display,
                basename: item.name,
                type: item.isDirectory() ? "directory" : "file",
                size: item.isDirectory() ? 0 : item.size
            }))
        );
}

export function getWebDAVClient() {
    return __webdavClient;
}

export function testWebDAVConnection(client) {
    log.info("Testing WebDAV connection...");
    return client
        .getDirectoryContents("/")
        .then(() => {
            log.info("WebDAV connected successfully");
            return true;
        })
        .catch(err => {
            log.error(`WebDAV failed to connect: ${err.message}`);
            return false;
        });
}
