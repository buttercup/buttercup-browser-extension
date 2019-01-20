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

export function lockArchive(sourceID) {
    log.info(`Sending request to background to lock archive source: ${sourceID}`);
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "lock-archive", sourceID }, response => {
            const { ok, error } = response;
            if (ok) {
                return resolve();
            }
            return reject(new Error(`Locking archive failed: ${error}`));
        });
    });
}

export function removeArchive(sourceID) {
    log.info(`Sending request to background for the removal of archive source: ${sourceID}`);
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "remove-archive", sourceID }, response => {
            const { ok, error } = response;
            if (ok) {
                return resolve();
            }
            return reject(new Error(`Adding removal failed: ${error}`));
        });
    });
}

export function trackUserActivity() {
    chrome.runtime.sendMessage({ type: "set-user-activity" });
}
