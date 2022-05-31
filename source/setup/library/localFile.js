import { basename, join } from "path-posix";
import { localFileClient } from "../../shared/library/buttercup.js";

const { buildClient, completeConnection, initiateConnection } = localFileClient;
let __client;

export function createNewClient(key) {
    __client = null;
    __client = buildClient(key);
}

export function getClient() {
    return __client;
}

export function getLocalDirectoryContents(directory, client = getClient()) {
    return new Promise((resolve, reject) => {
        client.readdir(directory, (err, contents) => {
            if (err) {
                return reject(err);
            }
            const results = contents.map(item => ({
                filename: join(directory, item.name),
                basename: item.name,
                type: item.type,
                size: -1
            }));
            resolve(results);
        });
    });
}

export function localContentsToTree(allItems) {
    const itemToFile = item => ({
        path: item.filename,
        name: item.basename
    });
    const buildItem = (directory, items) => {
        return {
            path: directory,
            name: basename(directory),
            directories: (items || [])
                .filter(item => item.type === "directory")
                .map(item =>
                    allItems[item.filename]
                        ? buildItem(item.filename, allItems[item.filename])
                        : {
                              path: item.filename,
                              name: basename(item.filename),
                              directories: [],
                              files: []
                          }
                ),
            files: (items || []).filter(item => item.type === "file").map(itemToFile)
        };
    };
    return buildItem("/", allItems["/"]);
}

export function receiveAuthKey(code) {
    return completeConnection(code);
}

export function requestConnection() {
    return initiateConnection();
}
