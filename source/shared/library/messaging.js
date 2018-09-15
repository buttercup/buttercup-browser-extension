export function searchEntriesForTerm(searchTerm) {
    chrome.runtime.sendMessage({ type: "search-entries-for-term", term: searchTerm });
}

export function searchEntriesForURL(url) {
    chrome.runtime.sendMessage({ type: "search-entries-for-url", url });
}

export function setCurrentVaultContext(vaultId) {
    chrome.runtime.sendMessage({ type: "set-current-vault-context", vaultId });
}
