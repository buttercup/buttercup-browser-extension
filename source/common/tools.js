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
        text = text.toLowerCase();
        return text.charAt(0).toUpperCase() + text.substr(1);
    }

};

export default tools;
