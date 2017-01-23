const NOPE = function() {};

export default {

    processAccessToken: function(fragment) {
        fragment = fragment.replace(/^#/, "");
        let blocks = (fragment || "").split("&"),
            blockNum = blocks.length;
        for (let i = 0; i < blockNum; i += 1) {
            let [ key, value ] = blocks[i].split("=");
            if (key === "access_token") {
                chrome.runtime.sendMessage({
                    command: "set-dropbox-token",
                    token: value
                }, NOPE);
                setTimeout(function() {
                    chrome.runtime.sendMessage({ command: "close-tab" }, NOPE);
                }, 50);
                break;
            }
        }
    }

};
