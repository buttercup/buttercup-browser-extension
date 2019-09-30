import ms from "ms";
import log from "../../shared/library/log.js";
import { dispatch, getState } from "../redux/index.js";
import { setAuthCode as setGoogleDriveAuthCode } from "../../shared/actions/googleDrive.js";
import { setUserActivity } from "../../shared/actions/app.js";
import { getAutoLoginDetails } from "../../shared/selectors/autoLogin.js";
import { clearAutoLogin } from "../../shared/actions/autoLogin.js";
import { sendTabMessage } from "../../shared/library/extension.js";
import { getEntry } from "./archives.js";
import { setAuthToken as setDropboxAuthToken } from "../../shared/actions/dropbox.js";
import { getTokens as getMyButtercupTokens } from "./myButtercup.js";
import {
    setAccessToken as setMyButtercupAccessToken,
    setRefreshToken as setMyButtercupRefreshToken
} from "../../shared/actions/myButtercup.js";

const AUTOLOGIN_EXPIRY = ms("45s");
const BUTTERCUP_DOMAIN_REXP = /^https:\/\/buttercup.pw\//;
const DROPBOX_ACCESS_TOKEN_REXP = /access_token=([^&]+)/;
const GOOGLE_DRIVE_AUTH_CODE_REXP = /\?googleauth&code=([^&#?]+)/;
const MYBUTTERCUP_AUTH_CODE_REXP = /code=([^&]+)/;
const MYBUTTERCUP_CALLBACK_URL_REXP = /^https?:\/\/(localhost:8000|my\.buttercup\.pw)\/oauth\/authorized\//;

export function attachBrowserStateListeners() {
    chrome.tabs.onUpdated.addListener(handleTabUpdatedEvent);
    chrome.tabs.onRemoved.addListener(handleTabRemovedEvent);
}

function handleTabUpdatedEvent(tabID, changeInfo) {
    // This event: https://developer.chrome.com/extensions/tabs#event-onUpdated
    const { url } = changeInfo;
    const autoLogin = getAutoLoginDetails(getState());
    if (BUTTERCUP_DOMAIN_REXP.test(url)) {
        const googleDriveAuthCodeMatch = url.match(GOOGLE_DRIVE_AUTH_CODE_REXP);
        const dropboxTokenMatch = url.match(DROPBOX_ACCESS_TOKEN_REXP);
        if (googleDriveAuthCodeMatch) {
            const authCode = googleDriveAuthCodeMatch[1];
            log.info(`Retrieved Google Drive auth code from tab: ${tabID}`);
            dispatch(setGoogleDriveAuthCode(authCode));
            chrome.tabs.remove(tabID);
        } else if (dropboxTokenMatch) {
            const token = dropboxTokenMatch[1];
            log.info(`Retrieved Dropbox access token from tab: ${tabID}`);
            dispatch(setDropboxAuthToken(token));
            chrome.tabs.remove(tabID);
        }
    } else if (changeInfo.status === "complete" && autoLogin.tabID === tabID) {
        log.info(
            `Auto-login activated for tab ${tabID} using entry ${autoLogin.entryID} on source ${autoLogin.sourceID}`
        );
        dispatch(clearAutoLogin());
        getEntry(autoLogin.sourceID, autoLogin.entryID)
            .then(entry => {
                sendTabMessage(tabID, {
                    type: "auto-login",
                    username: entry.getProperty("username"),
                    password: entry.getProperty("password")
                });
            })
            .catch(err => {
                log.error(
                    `Failed automatically logging in with entry ${autoLogin.entryID} on source ${autoLogin.sourceID}: ${
                        err.message
                    }`
                );
            });
    } else if (MYBUTTERCUP_CALLBACK_URL_REXP.test(url)) {
        const authCodeMatch = url.match(MYBUTTERCUP_AUTH_CODE_REXP);
        if (authCodeMatch) {
            const authCode = authCodeMatch[1];
            log.info(`Retrieved MyButtercup auth code from tab: ${tabID}`);
            chrome.tabs.remove(tabID);
            getMyButtercupTokens(authCode)
                .then(tokens => {
                    log.info("Exchanged MyButtercup authorisation code for tokens");
                    dispatch(setMyButtercupAccessToken(tokens.accessToken));
                    dispatch(setMyButtercupRefreshToken(tokens.refreshToken));
                })
                .catch(err => {
                    log.error(`Failed exchanging MyButtercup authorisation code for tokens: ${err.message}`);
                });
        }
    }
    if (autoLogin.setTime && Date.now() - autoLogin.setTime >= AUTOLOGIN_EXPIRY) {
        log.info("Auto-login session expired: details cleared");
        dispatch(clearAutoLogin());
    }
    if (changeInfo.status === "loading") {
        dispatch(setUserActivity());
    }
}

function handleTabRemovedEvent(tabID, removeInfo) {
    dispatch(setUserActivity());
}
