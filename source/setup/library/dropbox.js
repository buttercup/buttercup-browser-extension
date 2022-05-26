import { basename } from "path-posix";
import { generateAuthorisationURL } from "@buttercup/dropbox-client";

const DROPBOX_CALLBACK_URL = "https://buttercup.pw/";
const DROPBOX_CLIENT_ID = "5fstmwjaisrt06t";

export function dropboxContentsToTree(allItems) {
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

export function performAuthentication() {
    const url = generateAuthorisationURL(DROPBOX_CLIENT_ID, DROPBOX_CALLBACK_URL);
    chrome.tabs.create({ url });
}
