function getEntryData(archiveID, entryID) {
    return new Promise(function _getEntryData(resolve, reject) {
        const timeout = setTimeout(() => reject(new Error("Timed-out getting entry data")), 200);
        chrome.runtime.sendMessage(
            { command: "get-entry-raw", archiveID, entryID },
            function _handleMessageCallback(response) {
                clearTimeout(timeout);
                if (response.ok !== true) {
                    return reject(new Error(response.error || "Failed fetching entry for ID"));
                }
                return resolve(response.data);
            }
        );
    });
}

export default {
    getEntryData
};
