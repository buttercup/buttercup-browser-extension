const KEY = "searching";

export function getEntryResults(state) {
    return state[KEY].entryResults;
}

export function getSourcesCount(state) {
    return state[KEY].sourcesCount;
}
