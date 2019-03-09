import { basename } from "path";
import { createNewTab } from "./extension.js";

const GOOGLE_DRIVE_AUTH_URL =
    "https://accounts.google.com/o/oauth2/v2/auth?client_id=327941947801-77omjmf78j5ad6fgnvbliv34rngb1mhd.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fbuttercup.pw%3Fgoogleauth&response_type=token&scope=email%20profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive";

export function googleDriveContentsToTree(allItems) {
    const itemToFile = item => ({
        path: item.filename,
        name: item.basename,
        key: item.key || item.filename
    });
    const buildItem = (directory, items) => {
        return {
            path: directory,
            name: basename(directory),
            directories: (items || []).filter(item => item.type === "directory").map(
                item =>
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

export function groupContentsByDirectory(allItems) {
    const contents = allItems.filter(item => item.type === "directory").reduce(
        (index, nextItem) => ({
            ...index,
            [nextItem.filename]: allItems.filter(item => item.parent === nextItem.filename)
        }),
        {}
    );
    contents["/"] = allItems.filter(item => item.parent === "/");
    return contents;
}

export function performAuthentication() {
    return createNewTab(GOOGLE_DRIVE_AUTH_URL);
}
