(function() {

    "use strict";

    window.BC = {

        addWebDAV: function(details) {
            details.type = "webdav";
            details.command = "addArchive";
            chrome.runtime.sendMessage(details, function(response) {
                console.log("done", response);
            });
        }

    };

})();
