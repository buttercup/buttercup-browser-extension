const KEY = "webdav";

export function getAllDirectoryContents(state) {
    return state[KEY].directoryContents;
}

export function getDirectoryContents(state, directory) {
    return getAllDirectoryContents(state)[directory];
}
