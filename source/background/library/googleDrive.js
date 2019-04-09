import watch from "redux-watch";
import ms from "ms";
import uuid from "uuid/v4";
import sleep from "sleep-promise";
import { OAuth2Client } from "google-auth-library";
import store, { dispatch, getState } from "../redux/index.js";
import { clearGoogleDriveState, setAuthID, setAuthCode } from "../../shared/actions/googleDrive.js";
import { performAuthentication } from "../../shared/library/googleDrive.js";
import { getAuthID, getAuthCode } from "../../shared/selectors/googleDrive.js";
import { closeTabs, createNewTab } from "../../shared/library/extension.js";
import { getArchiveManager } from "./buttercup.js";
import secrets from "../../../secrets.json";
import { resolve } from "dns";

const OAUTH_REDIRECT_URL = "https://buttercup.pw?googleauth";

export async function authenticateWithoutToken() {
    const oauth2Client = getOAuthClient();
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["email", "profile", "https://www.googleapis.com/auth/drive"],
        prompt: "consent"
    });
    const cleanup = async () => {
        clearTimeout(timeout);
        rejectWaitingPromise(new Error("Timed-out waiting for authorisation"));
        await closeTabs(tab.id);
    };
    const authID = uuid();
    let rejectWaitingPromise;
    dispatch(setAuthCode(null));
    dispatch(setAuthID(authID));
    const waitForAuth = new Promise((resolve, reject) => {
        rejectWaitingPromise = reject;
        const watchAuthID = watch(() => getAuthCode(getState()));
        const unsubscribe = store.subscribe(
            watchAuthID(async authCode => {
                if (authCode) {
                    const firedAuthID = getAuthID(getState());
                    if (firedAuthID === authID) {
                        dispatch(clearGoogleDriveState());
                        const tokens = await exchangeAuthCodeForTokens(oauth2Client, authCode);
                        resolve(tokens);
                    }
                    cleanup();
                }
            })
        );
    });
    const tab = await createNewTab(url);
    const timeout = setTimeout(cleanup, ms("2m"));
    return await waitForAuth;
}

export async function authenticateWithRefreshToken(accessToken, refreshToken) {
    const oauth2Client = getOAuthClient();
    oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    });
    return await oauth2Client.refreshToken(refreshToken);
}

async function exchangeAuthCodeForTokens(oauth2Client, authCode) {
    const response = await oauth2Client.getToken(authCode);
    const { access_token: accessToken, refresh_token: refreshToken = null } = response.tokens;
    console.log("RES", authCode, response);
    if (!accessToken) {
        throw new Error("Failed getting access token");
    }
    return {
        accessToken,
        refreshToken
    };
}

function getOAuthClient() {
    const { googleDriveClientID, googleDriveClientSecret } = secrets;
    if (!googleDriveClientID || !googleDriveClientSecret) {
        throw new Error("Failed authenticating Google Drive: Client ID or secret not provided");
    }
    return new OAuth2Client(googleDriveClientID, googleDriveClientSecret, OAUTH_REDIRECT_URL);
}
