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

export function lockAllArchives() {
    log.info("Sending request to background to lock all archives");
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "lock-all-archives" }, response => {
            const { ok, error } = response;
            if (ok) {
                return resolve();
            }
            return reject(new Error(`Locking archives failed: ${error}`));
        });
    });
}
