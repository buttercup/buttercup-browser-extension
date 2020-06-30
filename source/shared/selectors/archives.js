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
    return (archive && archive.name) || "";
}

export function getArchiveType(state, id) {
    const archive = getArchives(state).find(archive => archive.id === id);
    return (archive && archive.type) || null;
}

export function getTotalArchivesCount(state) {
    return state[KEY].total;
}

export function getUnlockedArchivesCount(state) {
    return state[KEY].unlocked;
}
