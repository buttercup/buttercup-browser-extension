export default {

    getEntryData: function(archiveID, entryID) {
        return new Promise(function(resolve, reject) {
            let timeout = setTimeout(() => reject(new Error("Timed-out getting entry data")), 200);
            chrome.runtime.sendMessage({ command: "get-entry-raw", archiveID, entryID }, function(response) {
                clearTimeout(timeout);
                if (response.ok !== true) {
                    return reject(new Error(response.error || "Failed fetching entry for ID"));
                }
                resolve(response.data);
            });
        });
    }

};
