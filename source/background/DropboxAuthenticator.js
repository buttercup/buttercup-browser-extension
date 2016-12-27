const Dropbox = require("dropbox");
const dbTools = require("./dropbox.js");

class DropboxAuthenticator {

    constructor(accessToken) {
        this._token = accessToken;
        this._client = (accessToken) ?
            new Dropbox({ accessToken }) :
            new Dropbox({
                clientId: "5fstmwjaisrt06t"
            });
    }

    get client() {
        return this._client;
    }

    get token() {
        return this._token;
    }

    authenticate() {
        let callbackURL = "https://buttercup.pw/",
            dropboxURL = this.client.getAuthenticationUrl(callbackURL);
        chrome.tabs.create({ url: dropboxURL });
        return new Promise((resolve, reject) => {
            // get-dropbox-token
            let interval = setInterval(function() {
                let token = dbTools.getToken();
                if (token) {
                    this._token = token;
                    dbTools.setToken(null);
                    resolve();
                }
            }, 100);
        });
    }

}

module.exports = DropboxAuthenticator;
