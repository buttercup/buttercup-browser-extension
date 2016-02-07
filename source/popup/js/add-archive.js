(function(module) {
    "use strict";

    module.exports = {

        webDAV: function(details) {
            details.type = "webdav";
            details.command = "addArchive";
            chrome.runtime.sendMessage(details, function(response) {
                console.log("done", response);
            });
        }

    };

})(module);
