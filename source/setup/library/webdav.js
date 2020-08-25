import { basename } from "path";

export function webdavContentsToTree(allItems) {
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
