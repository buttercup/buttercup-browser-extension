import { createClient as createWebDAVClient } from "webdav";
import {
    createClient as createDropboxClient,
    createFsInterface as createDropboxFSClient
} from "@buttercup/dropbox-client";
import joinPath from "path.join";
import pify from "pify";
import log from "../../shared/library/log.js";
import { getState } from "../redux/index.js";
import { getAuthToken as getDropboxAuthToken } from "../../shared/selectors/dropbox.js";

let __webdavClient = null,
    __dropboxClient = null;

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
    if (!__dropboxClient) {
        const state = getState();
        const authToken = getDropboxAuthToken(state);
        if (!authToken) {
            throw new Error("Unable to create Dropbox client: No token found");
        }
        __dropboxClient = createDropboxFSClient(createDropboxClient(authToken));
    }
    return __dropboxClient;
}

export function getDropboxDirectoryContents(directory, dropboxClient = getDropboxFSClient()) {
    const readDir = pify(::dropboxClient.readdir);
    return readDir(directory, { mode: "stat" }).then(contents =>
        contents.map(item => ({
            filename: item.path,
            basename: item.name,
            type: item.type,
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
