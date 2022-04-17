import watch from "redux-watch";
import ms from "ms";
import uuid from "uuid/v4";
import { OAuth2Client } from "@buttercup/google-oauth2-client";
import store, { dispatch, getState } from "../redux/index.js";
import { setAccessToken, setAuthID, setAuthCode, setRefreshToken } from "../../shared/actions/googleDrive.js";
import { performAuthentication } from "../../shared/library/googleDrive.js";
import { getAuthID, getAuthCode } from "../../shared/selectors/googleDrive.js";
import { closeTabs, createNewTab } from "../../shared/library/extension.js";
import { getVaultManager } from "./buttercup.js";
import secrets from "../../shared/google-client.json";

const GOOGLE_DRIVE_BASE_SCOPES = ["email", "profile"];
const GOOGLE_DRIVE_SCOPES_STANDARD = [
    ...GOOGLE_DRIVE_BASE_SCOPES,
    "https://www.googleapis.com/auth/drive.file" // Per-file access
];
const GOOGLE_DRIVE_SCOPES_PERMISSIVE = [...GOOGLE_DRIVE_BASE_SCOPES, "https://www.googleapis.com/auth/drive"];
const OAUTH_REDIRECT_URL = "https://buttercup.pw?googleauth";

export async function authenticateWithoutToken(authID = uuid(), useOpenPermissions = false) {
    const scopes = useOpenPermissions ? GOOGLE_DRIVE_SCOPES_PERMISSIVE : GOOGLE_DRIVE_SCOPES_STANDARD;
    const oauth2Client = getOAuthClient();
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [...scopes],
        prompt: "consent select_account"
    });
    const cleanup = async () => {
        clearTimeout(timeout);
        rejectWaitingPromise(new Error("Timed-out waiting for authorisation"));
        await closeTabs(tab.id);
    };
    let rejectWaitingPromise;
    dispatch(setAuthCode(null));
    dispatch(setAccessToken(null));
    dispatch(setRefreshToken(null));
    dispatch(setAuthID(authID));
    const waitForAuth = new Promise((resolve, reject) => {
        rejectWaitingPromise = reject;
        const watchAuthID = watch(() => getAuthCode(getState()));
        const unsubscribe = store.subscribe(
            watchAuthID(async authCode => {
                if (authCode) {
                    const firedAuthID = getAuthID(getState());
                    if (firedAuthID === authID) {
                        dispatch(setAuthCode(authCode));
                        const tokens = await exchangeAuthCodeForTokens(oauth2Client, authCode);
                        dispatch(setAccessToken(tokens.accessToken));
                        dispatch(setRefreshToken(tokens.refreshToken));
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
    dispatch(setAuthCode(null));
    dispatch(setAccessToken(null));
    const oauth2Client = getOAuthClient();
    const results = await oauth2Client.refreshAccessToken(refreshToken);
    const { access_token: newAccessToken } = results.tokens;
    dispatch(setAccessToken(newAccessToken));
    return {
        accessToken: newAccessToken,
        refreshToken
    };
}

async function exchangeAuthCodeForTokens(oauth2Client, authCode) {
    const response = await oauth2Client.exchangeAuthCodeForToken(authCode);
    const { access_token: accessToken, refresh_token: refreshToken = null } = response.tokens;
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
