export function searchEntriesForTerm(searchTerm) {
    chrome.runtime.sendMessage({ type: "search-entries-for-term", term: searchTerm });
}

export function searchEntriesForURL(url) {
    chrome.runtime.sendMessage({ type: "search-entries-for-url", url });
}

export function setConfig(key, value) {
    chrome.runtime.sendMessage({ type: "set-config", key, value });
}

export function trackUserActivity() {
    chrome.runtime.sendMessage({ type: "set-user-activity" });
}
