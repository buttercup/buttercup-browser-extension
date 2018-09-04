import log from "../../shared/library/log.js";

export function clearSearchResults() {
    chrome.runtime.sendMessage({ type: "clear-search" });
}

export function requestCredentialsOpening(sourceID, entryID) {
    chrome.runtime.sendMessage({
        type: "open-credentials-url",
        sourceID,
        entryID
    });
}
