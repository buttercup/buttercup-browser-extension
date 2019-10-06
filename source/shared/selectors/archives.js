const KEY = "archives";

export function getArchives(state) {
    return state[KEY].archives;
}

export function getArchiveState(state, id) {
    const archive = getArchives(state).find(archive => archive.id === id);
    return (archive && archive.state) || "unknown";
}

export function getArchiveTitle(state, id) {
    const archive = getArchives(state).find(archive => archive.id === id);
    return (archive && archive.title) || "";
}

export function getUnlockedArchivesCount(state) {
    return state[KEY].unlocked;
}
