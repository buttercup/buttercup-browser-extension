window.Buttercup = {

    fetchArchives: function() {
        return new Promise(function(resolve, reject) {
            let timeout = setTimeout(() => reject(new Error("Timed-out getting archive list")), 200);
            chrome.runtime.sendMessage({ command: "get-archive-states" }, function(response) {
                clearTimeout(timeout);
                resolve(response);
            });
        });
    }

};
