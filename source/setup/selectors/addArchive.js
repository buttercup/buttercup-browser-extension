const KEY = "addArchive";

export function getLocalAuthKey(state) {
    return state[KEY].localAuthKey;
}

export function getLocalAuthStatus(state) {
    return state[KEY].localAuthStatus;
}

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

export function myButtercupAccountReady(state) {
    return state[KEY].accountReady;
}

export function selectedFileNeedsCreation(state) {
    return state[KEY].shouldCreateRemoteFile;
}
