(function() {

    "use strict";

    window.BC = {

        getArchiveNames: function() {
            //return Promise.resolve(["number 1", "number 2"]);
            return new Promise(function(resolve, reject) {
                chrome.runtime.sendMessage(
                    {
                        command: "getArchiveNames",
                        state: "any"
                    },
                    function(response) {
                        console.log("RESPONSE", response);
                        if (response && response.names) {
                            (resolve)(response.names);
                        } else {
                            (reject)(new Error("Failed getting archive names"));
                        }
                    }
                );
            });
        }

    };

})();
