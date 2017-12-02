import createWebDAVClient, { setFetchMethod } from "webdav";
import log from "../../shared/library/log.js";

setFetchMethod(window.fetch);

let __webdavClient = null;

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
