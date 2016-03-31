(function() {

    "use strict";

    window.BC = {

        addWebDAV: function(details) {
            details.type = "webdav";
            details.command = "addArchive";
            chrome.runtime.sendMessage(details, function(response) {
                if (response && response.success === true) {
                    chrome.tabs.getCurrent(function(tab) {
                        chrome.tabs.remove(tab.id, function() { });
                    });
                } else {
                    throw new Error("Failed adding archive");
                }
            });
        }

    };

})();
