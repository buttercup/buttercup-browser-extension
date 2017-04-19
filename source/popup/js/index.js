import { placeStylesheet } from "../../common/styles";

window.Buttercup = {

    fetchArchives: function() {
        return new Promise(function(resolve, reject) {
            let timeout = setTimeout(() => reject(new Error("Timed-out getting archive list")), 200);
            chrome.runtime.sendMessage({ command: "get-archive-states" }, function(response) {
                clearTimeout(timeout);
                resolve(response);
            });
        });
    },

    lockArchive: function(name) {
        return new Promise(function(resolve, reject) {
            let timeout = setTimeout(() => reject(new Error("Timed-out locking archive")), 4000);
            chrome.runtime.sendMessage({ command: "lock-archive", name }, function(response) {
                clearTimeout(timeout);
                if (response && response.ok) {
                    resolve(response);
                } else {
                    reject(new Error(response.error));
                }
            });
        });
    }

};

placeStylesheet();
