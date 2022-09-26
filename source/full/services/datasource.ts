import ms from "ms";
import { sendBackgroundMessage } from "./messaging.js";
import { BackgroundMessageType, VaultType } from "../types.js";
import { ADD_VAULT_STATE } from "../state/addVault.js";

export function processDropboxAuthentication() {
    sendBackgroundMessage<{ token: string }>(
        {
            type: BackgroundMessageType.AuthenticateProvider,
            datasource: VaultType.Dropbox
        },
        ms("2m")
    )
        .then(({ token }) => {
            ADD_VAULT_STATE.dropboxToken = token;
        })
        .catch((err) => {
            console.error(err);
            ADD_VAULT_STATE.authError = err.message;
        });
}
