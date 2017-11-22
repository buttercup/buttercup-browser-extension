const KEY = "webdav";

export function getAllDirectoryContents(state) {
    return state[KEY].directoryContents;
}

export function getDirectoryContents(state, directory) {
    return getAllDirectoryContents(state)[directory];
}

export function getDirectoriesLoading(state) {
    return state[KEY].directoriesLoading;
}
