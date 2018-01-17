const KEY = "addArchive";

export function getSelectedArchiveType(state) {
    return state[KEY].selectedArchiveType;
}

export function getSelectedFilename(state) {
    return state[KEY].selectedRemoteFile;
}

export function isConnected(state) {
    return state[KEY].connected;
}

export function isConnecting(state) {
    return state[KEY].connecting;
}

export function selectedFileNeedsCreation(state) {
    return state[KEY].shouldCreateRemoteFile;
}
