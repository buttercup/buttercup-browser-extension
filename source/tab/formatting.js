module.exports = {

    formatURLForSaving: function(url) {
        // strip protocol
        url = url.replace(/^https?:\/\//i, "");
        // remove query string
        url = url.split("?").shift();
        // remove fragment
        url = url.split("#").shift();
        return url;
    }

};
