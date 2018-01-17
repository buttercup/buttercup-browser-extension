const KEY = "searching";

export function getEntryResults(state) {
    return state[KEY].entryResults;
}

function getEntryResult(state, sourceID, entryID) {
    const results = getEntryResults(state);
    return results.find(result => result.sourceID === sourceID && result.id === entryID);
}

export function getEntryResultPath(state, sourceID, entryID) {
    const result = getEntryResult(state, sourceID, entryID);
    return [result.sourceName, ...result.entryPath];
}

export function getEntryResultTitle(state, sourceID, entryID) {
    const result = getEntryResult(state, sourceID, entryID);
    return (result && result.title) || "";
}

export function getEntryResultURL(state, sourceID, entryID) {
    const result = getEntryResult(state, sourceID, entryID);
    return result && result.url;
}

export function getSourcesCount(state) {
    return state[KEY].sourcesCount;
}
