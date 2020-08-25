import { basename } from "path";
import Dropbox from "dropbox";

const DROPBOX_CALLBACK_URL = "https://buttercup.pw/";
const DROPBOX_CLIENT_ID = "5fstmwjaisrt06t";

let __client;

export function dropboxContentsToTree(allItems) {
    const itemToFile = item => ({
        path: item.filename,
        name: item.basename,
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
                              files: [],
                          }
                ),
            files: (items || []).filter(item => item.type === "file").map(itemToFile),
        };
    };
    return buildItem("/", allItems["/"]);
}

export function getClient() {
    if (!__client) {
        __client = new Dropbox({
            clientId: DROPBOX_CLIENT_ID,
        });
    }
    return __client;
}

export function performAuthentication() {
    const client = getClient();
    const url = client.getAuthenticationUrl(DROPBOX_CALLBACK_URL);
    chrome.tabs.create({ url });
}
