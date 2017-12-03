const STATE_KEY = "archives";

export function getArchives(state) {
    return state[STATE_KEY].archives;
}

export function getArchiveTitle(state, id) {
    const archive = getArchives(state).find(archive => archive.id === id);
    return (archive && archive.title) || "";
}
