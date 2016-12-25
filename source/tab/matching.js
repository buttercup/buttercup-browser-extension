module.exports = {

    getItemsForCurrentURL: function() {
        let currentURL = window.location.href;
        return new Promise(function(resolve, reject) {
            let timeout = setTimeout(() => reject(new Error("Timed-out getting archive list")), 200);
            chrome.runtime.sendMessage({ command: "get-entries-for-url", url: currentURL }, function(response) {
                clearTimeout(timeout);
                if (response.ok !== true) {
                    return reject(new Error(response.error || "Failed fetching entries for URL"));
                }
                resolve(response.entries);
            });
        });
    }

};
