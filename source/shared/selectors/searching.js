const KEY = "searching";

export function getEntryResults(state) {
    return state[KEY].entryResults;
}

export function getEntryResultTitle(state, sourceID, entryID) {
    const results = getEntryResults(state);
    const result = results.find(result => result.sourceID === sourceID && result.id === entryID);
    return (result && result.title) || "";
}

export function getEntryResultURL(state, sourceID, entryID) {
    const results = getEntryResults(state);
    const result = results.find(result => result.sourceID === sourceID && result.id === entryID);
    return result && result.url;
}

export function getSourcesCount(state) {
    return state[KEY].sourcesCount;
}
