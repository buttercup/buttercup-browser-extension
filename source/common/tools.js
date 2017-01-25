"use strict";

let tools = {

    niceType: function(type) {
        switch (type) {
            case "webdav":
                return "WebDAV";
            case "owncloud":
                return "ownCloud";
            case "dropbox":
                return "Dropbox";

            default:
                return tools.ucFirst(type);
        }
    },

    ucFirst: function(text) {
        let formattedText = text.toLowerCase();
        return formattedText.charAt(0).toUpperCase() + formattedText.substr(1);
    }

};

export default tools;
