const KEY = "archives";

export function getArchives(state) {
    return state[KEY].archives;
}

export function getArchiveTitle(state, id) {
    const archive = getArchives(state).find(archive => archive.id === id);
    return (archive && archive.title) || "";
}

export function getUnlockedArchivesCount(state) {
    return state[KEY].unlocked;
}
