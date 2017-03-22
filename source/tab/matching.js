function getItemsForCurrentURL() {
    let currentURL = window.location.href;
    return new Promise(function(resolve, reject) {
        let timeout = setTimeout(() => reject(new Error("Timed-out getting entries")), 200);
        chrome.runtime.sendMessage({ command: "get-entries-for-url", url: currentURL }, function(response) {
            clearTimeout(timeout);
            if (response.ok !== true) {
                return reject(new Error(response.error || "Failed fetching entries for URL"));
            }
            return resolve(response.entries);
        });
    });
}

function getItemsForSearchQuery(query) {
    return new Promise(function(resolve, reject) {
        let timeout = setTimeout(() => reject(new Error("Timed-out getting entries")), 200);
        chrome.runtime.sendMessage({ command: "get-entries-for-search", query }, function(response) {
            clearTimeout(timeout);
            if (response.ok !== true) {
                return reject(new Error(response.error || "Failed fetching entries for search query"));
            }
            return resolve(response.entries);
        });
    });
}

export default {
    getItemsForCurrentURL,
    getItemsForSearchQuery
};
