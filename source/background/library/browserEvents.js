import log from "../../shared/library/log.js";
import { dispatch } from "../redux/index.js";
import { setAuthToken } from "../../shared/actions/dropbox.js";

const BUTTERCUP_DOMAIN_REXP = /^https:\/\/buttercup.pw\//;
const DROPBOX_ACCESS_TOKEN_REXP = /access_token=([^&]+)/;

export function attachBrowserStateListeners() {
    chrome.tabs.onUpdated.addListener(handleTabUpdatedEvent);
}

function handleTabUpdatedEvent(tabID, changeInfo) {
    // This event: https://developer.chrome.com/extensions/tabs#event-onUpdated
    const { url } = changeInfo;
    if (BUTTERCUP_DOMAIN_REXP.test(url)) {
        const accessTokenMatch = url.match(DROPBOX_ACCESS_TOKEN_REXP);
        if (accessTokenMatch) {
            const token = accessTokenMatch[1];
            log.info(`Retrieved Dropbox access token from tab: ${tabID}`);
            dispatch(setAuthToken(token));
            chrome.tabs.remove(tabID);
        }
    }
}
