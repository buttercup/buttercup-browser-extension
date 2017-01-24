export default {

    formatURLForSaving: function(url) {
        // strip protocol
        let formattedURL = url.replace(/^https?:\/\//i, "");
        // remove query string
        formattedURL = formattedURL.split("?").shift();
        // remove fragment
        formattedURL = formattedURL.split("#").shift();
        return formattedURL;
    }

};
