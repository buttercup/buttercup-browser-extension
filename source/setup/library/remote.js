import { getSharedAppEnv } from "@buttercup/app-env";
import {
    createClient as createDropboxClient,
    createFsInterface as createDropboxFSClient
} from "@buttercup/dropbox-client";
import { createClient as createGoogleDriveClient } from "@buttercup/googledrive-client";
import joinPath from "path.join";
import pify from "pify";
import log from "../../shared/library/log.js";
import { getState } from "../redux/index.js";
import { getAuthToken as getDropboxAuthToken } from "../../shared/selectors/dropbox.js";
import { getAccessToken as getGoogleDriveAccessToken } from "../../shared/selectors/googleDrive.js";

let __webdavClient = null,
    __dropboxClient = null,
    __googleDriveClient = null;

export function connectWebDAV(url, username, password) {
    const createClient = getSharedAppEnv().getProperty("net/webdav/v1/newClient");
    const client = createClient(url, { username, password });
    log.info(`Creating WebDAV connection to: ${url}`);
    return testWebDAVConnection(client).then(succeeded => {
        if (succeeded) {
            log.info("Connection to WebDAV service succeeded");
            __webdavClient = client;
            return;
        }
        log.error(`Failed establishing WebDAV connection: ${url}`);
    });
}

export function disposeWebDAVConnection() {
    __webdavClient = null;
}

function getDropboxFSClient() {
    if (!__dropboxClient) {
        const state = getState();
        const authToken = getDropboxAuthToken(state);
        if (!authToken) {
            log.error("Unable to create Dropbox client: No token found");
            return;
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

function getGoogleDriveClient() {
    if (!__googleDriveClient) {
        const state = getState();
        const accessToken = getGoogleDriveAccessToken(state);
        if (!accessToken) {
            log.error("Unable to create Google Drive client: No token found");
            return;
        }
        __googleDriveClient = createGoogleDriveClient(accessToken);
    }
    return __googleDriveClient;
}

export function getGoogleDriveDirectoryContents(googleDriveClient = getGoogleDriveClient()) {
    const generateParentPath = items => (items.length === 0 ? "/" : `/${items.join("/")}`);
    const convertNode = (node, parentPath = []) => [
        ...node.children.map(dirItem => ({
            filename: generateParentPath([...parentPath, dirItem.filename]),
            basename: dirItem.filename,
            parent: generateParentPath(parentPath),
            type: "directory",
            size: 0,
            googleFileID: dirItem.id,
            key: dirItem.id
        })),
        ...node.files.map(fileItem => ({
            filename: generateParentPath([...parentPath, fileItem.filename]),
            basename: fileItem.filename,
            parent: generateParentPath(parentPath),
            type: "file",
            size: fileItem.size,
            googleFileID: fileItem.id,
            key: fileItem.id
        })),
        ...node.children.reduce(
            (convertedChildren, child) => [
                ...convertedChildren,
                ...convertNode(child, [...parentPath, child.filename])
            ],
            []
        )
    ];
    return googleDriveClient.getDirectoryContents({ tree: true }).then(convertNode);
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
