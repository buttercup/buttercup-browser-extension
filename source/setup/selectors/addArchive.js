const STATE_KEY = "addArchive";

export function getSelectedArchiveType(state) {
    return state[STATE_KEY].selectedArchiveType;
}
