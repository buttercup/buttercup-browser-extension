import ms from "ms";
import { VaultSourceID } from "buttercup";
import { sendBackgroundMessage } from "./messaging.js";
import { ADD_VAULT_STATE } from "../state/addVault.js";
import { log } from "./log.js";
import { AddVaultPayload, BackgroundMessageType, VaultType } from "../types.js";

export async function addVaultDatasource(payload: AddVaultPayload): Promise<void> {
    try {
        const { sourceID } = await sendBackgroundMessage<{ sourceID: VaultSourceID }>(
            {
                type: BackgroundMessageType.AddVault,
                payload
            },
            ms("30s")
        );
        // @todo open page with sourceID
        log(`source added: ${sourceID}`);
    } catch (err) {
        console.error(err);
        ADD_VAULT_STATE.error = err.message;
    }
}

export function processDropboxAuthentication() {
    sendBackgroundMessage<{ token: string }>(
        {
            type: BackgroundMessageType.AuthenticateProvider,
            datasource: VaultType.Dropbox
        },
        ms("2.5m")
    )
        .then(({ token }) => {
            ADD_VAULT_STATE.dropboxToken = token;
        })
        .catch((err) => {
            console.error(err);
            ADD_VAULT_STATE.error = err.message;
        });
}
