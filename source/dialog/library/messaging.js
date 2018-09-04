import log from "../../shared/library/log.js";

export function destroyLastLogin() {
    chrome.runtime.sendMessage({ type: "clear-used-credentials" });
}

export function getLastLogin() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "get-used-credentials" }, resp => {
            if (resp && resp.credentials.title) {
                resolve(resp.credentials);
            } else {
                reject(new Error("Failed getting last login details"));
            }
        });
    });
}

export function setGeneratedPassword(password) {
    chrome.runtime.sendMessage({ type: "set-generated-password", password });
}

export function sendCredentialsToTab(sourceID, entryID, signIn) {
    chrome.runtime.sendMessage(
        {
            type: "send-credentials-to-current-tab",
            sourceID,
            entryID,
            signIn
        },
        response => {
            if (!response.ok) {
                log.error(`Failed sending credentials to tab: ${response.error}`);
                alert(`An error occurred while trying to fetch credentials: ${response.error}`);
            }
        }
    );
}
