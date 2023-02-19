import EventEmitter from "eventemitter3";
import { getExtensionAPI } from "../../shared/extension.js";
import { log } from "./log.js";

const BUTTERCUP_DOMAIN_REXP = /^https:\/\/buttercup.pw\//;
const DROPBOX_ACCESS_TOKEN_REXP = /access_token=([^&]+)/;
const GOOGLE_DRIVE_AUTH_CODE_REXP = /\?googleauth&code=([^&#?]+)/;

let __eventEmitter: EventEmitter;

function attachTabEventListeners() {
    const browser = getExtensionAPI();
    browser.tabs.onUpdated.addListener(handleTabUpdatedEvent);
    browser.tabs.onRemoved.addListener(handleTabRemovedEvent);
}

export function getEmitter(): EventEmitter {
    if (!__eventEmitter) {
        __eventEmitter = new EventEmitter();
    }
    return __eventEmitter;
}

function handleTabUpdatedEvent(tabID: number, changeInfo: chrome.tabs.TabChangeInfo) {
    // This event: https://developer.chrome.com/extensions/tabs#event-onUpdated
    const { url } = changeInfo;
    // const autoLogin = getAutoLoginDetails(getState());
    if (BUTTERCUP_DOMAIN_REXP.test(url)) {
        const googleDriveAuthCodeMatch = url.match(GOOGLE_DRIVE_AUTH_CODE_REXP);
        const dropboxTokenMatch = url.match(DROPBOX_ACCESS_TOKEN_REXP);
        if (googleDriveAuthCodeMatch) {
            const authCode = decodeURIComponent(googleDriveAuthCodeMatch[1]);
            log(`retrieved Google Drive auth code from tab: ${tabID}`);
            getEmitter().emit("googleDriveCode", {
                code: authCode
            });
            chrome.tabs.remove(tabID);
        } else if (dropboxTokenMatch) {
            const token = dropboxTokenMatch[1];
            log(`retrieved Dropbox access token from tab: ${tabID}`);
            getEmitter().emit("dropboxToken", {
                token
            });
            chrome.tabs.remove(tabID);
        }
    }
    // else if (changeInfo.status === "complete" && autoLogin.tabID === tabID) {
    //     log.info(
    //         `Auto-login activated for tab ${tabID} using entry ${autoLogin.entryID} on source ${autoLogin.sourceID}`
    //     );
    //     dispatch(clearAutoLogin());
    //     getEntry(autoLogin.sourceID, autoLogin.entryID)
    //         .then(entry => {
    //             sendTabMessage(tabID, {
    //                 type: "auto-login",
    //                 username: entry.getProperty("username"),
    //                 password: entry.getProperty("password")
    //             });
    //         })
    //         .catch(err => {
    //             log.error(
    //                 `Failed automatically logging in with entry ${autoLogin.entryID} on source ${autoLogin.sourceID}: ${err.message}`
    //             );
    //         });
    // } else if (MYBUTTERCUP_CALLBACK_URL_REXP.test(url)) {
    //     const authCodeMatch = url.match(MYBUTTERCUP_AUTH_CODE_REXP);
    //     if (authCodeMatch) {
    //         const authCode = authCodeMatch[1];
    //         log.info(`Retrieved MyButtercup auth code from tab: ${tabID}`);
    //         chrome.tabs.remove(tabID);
    //         log.info("Exchanging My Buttercup authorisation code for tokens");
    //         getMyButtercupTokens(authCode)
    //             .then(tokens => {
    //                 log.info("Fetching My Buttercup vault details");
    //                 return processMyButtercupVaultDetails(tokens.accessToken, tokens.refreshToken).then(() => tokens);
    //             })
    //             .then(tokens => {
    //                 log.info("My Buttercup authorisation complete");
    //                 dispatch(setMyButtercupAccessToken(tokens.accessToken));
    //                 dispatch(setMyButtercupRefreshToken(tokens.refreshToken));
    //             })
    //             .catch(err => {
    //                 log.error(`Failed exchanging MyButtercup authorisation code for tokens: ${err.message}`);
    //             });
    //     }
    // }
    // if (autoLogin.setTime && Date.now() - autoLogin.setTime >= AUTOLOGIN_EXPIRY) {
    //     log.info("Auto-login session expired: details cleared");
    //     dispatch(clearAutoLogin());
    // }
    // if (changeInfo.status === "loading") {
    //     dispatch(setUserActivity());
    // }
}

function handleTabRemovedEvent(tabID: number, removeInfo: chrome.tabs.TabRemoveInfo) {
    getEmitter().emit("tabClosed", { tabID });
}

export async function initialise() {
    attachTabEventListeners();
}
