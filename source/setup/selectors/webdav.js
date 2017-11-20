const KEY = "webdav";

export function getAllDirectoryContents(state) {
    return state[KEY].directoryContents;
}
