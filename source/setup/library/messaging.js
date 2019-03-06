import VError from "verror";
import log from "../../shared/library/log.js";

export function addNewEntry(sourceID, groupID, details) {
    const payload = {
        sourceID,
        groupID,
        ...details
    };
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "add-new-entry", payload }, resp => {
            if (resp && resp.ok) {
                return resolve();
            }
            const error = new VError(
                {
                    info: { authFailure: resp.authFailure }
                },
                `Failed adding new entry: ${(resp && resp.error) || "Unknown error"}`
            );
            reject(error);
        });
    });
}

export function clearLastLogin() {
    chrome.runtime.sendMessage({ type: "clear-used-credentials" });
}

export function getArchivesGroupTree(sourceID) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "get-groups-tree", sourceID }, resp => {
            if (resp && resp.ok) {
                resolve(resp.groups);
            } else {
                reject(new Error(`Failed getting archive contents: ${(resp && resp.error) || "Unknown error"}`));
            }
        });
    });
}

export function getLastLogin() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "get-used-credentials", force: true }, resp => {
            if (resp && resp.credentials && resp.credentials.title) {
                resolve(resp.credentials);
            } else {
                reject(new Error("Failed getting last login details"));
            }
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

export function makeArchiveAdditionRequest(payload) {
    log.info("Making request to background for storing a new archive");
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "add-archive", payload }, response => {
            const { ok, error } = response;
            if (ok) {
                return resolve();
            }
            return reject(new Error(`Adding archive failed: ${error}`));
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

export function unlockArchive(sourceID, masterPassword) {
    log.info(`Making request to background to unlock archive source: ${sourceID}`);
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "unlock-archive", sourceID, masterPassword }, response => {
            const { ok, error, hush = false } = response;
            if (ok) {
                return resolve();
            }
            return reject(
                new VError(
                    {
                        info: { hush }
                    },
                    `Unlocking archive source (${sourceID}) failed: ${error}`
                )
            );
        });
    });
}
