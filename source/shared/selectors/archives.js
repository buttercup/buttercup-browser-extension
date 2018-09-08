const STATE_KEY = "archives";

export function getArchives(state) {
    return state[STATE_KEY].archives;
}

export function getArchiveTitle(state, id) {
    const archive = getArchives(state).find(archive => archive.id === id);
    return (archive && archive.title) || "";
}

export function getCurrentArchive(state) {
    const archives = getArchives(state);
    return archives.find(archive => archive.id === state.currentArchiveId);
}
