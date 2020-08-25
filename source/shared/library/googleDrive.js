import { basename } from "path";

export function googleDriveContentsToTree(allItems) {
    const itemToFile = item => ({
        path: item.filename,
        name: item.basename,
        key: item.key || item.filename,
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

export function groupContentsByDirectory(allItems) {
    const contents = allItems
        .filter(item => item.type === "directory")
        .reduce(
            (index, nextItem) => ({
                ...index,
                [nextItem.filename]: allItems.filter(item => item.parent === nextItem.filename),
            }),
            {}
        );
    contents["/"] = allItems.filter(item => item.parent === "/");
    return contents;
}
