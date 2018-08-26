import { MYBUTTERCUP_CALLBACK_URL } from "../../shared/library/myButtercup.js";

const MYBUTTERCUP_CLIENT_ID = "bcup_browser_ext";
const MYBUTTERCUP_OAUTH_URL = "http://localhost:8000/oauth/authorize";

function createOAuthURL(clientID) {
    const callback = encodeURIComponent(MYBUTTERCUP_CALLBACK_URL);
    return `${MYBUTTERCUP_OAUTH_URL}?response_type=token&client_id=${clientID}&redirect_uri=${callback}`;
}

export function performAuthentication() {
    const url = createOAuthURL(MYBUTTERCUP_CLIENT_ID);
    chrome.tabs.create({ url });
}
