import Dropbox from "dropbox";

const DROPBOX_CALLBACK_URL = "https://buttercup.pw/";
const DROPBOX_CLIENT_ID = "5fstmwjaisrt06t";

let __client;

export function getClient() {
    if (!__client) {
        __client = new Dropbox({
            clientId: DROPBOX_CLIENT_ID
        });
    }
    return __client;
}

export function performAuthentication() {
    const client = getClient();
    const url = client.getAuthenticationUrl(DROPBOX_CALLBACK_URL);
    chrome.tabs.create({ url });
}
