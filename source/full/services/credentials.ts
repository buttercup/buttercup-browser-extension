import { Layerr } from "layerr";
import { EntryType } from "buttercup";
import { sendBackgroundMessage } from "../../shared/services/messaging.js";
import { BackgroundMessageType, SavedCredentials, UsedCredentials } from "../types.js";

export async function getCredentials(): Promise<Array<UsedCredentials>> {
    const resp = await sendBackgroundMessage({
        type: BackgroundMessageType.GetSavedCredentials
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed fetching used credentials");
    }
    return resp.credentials;
}

export async function saveCredentialsToEntry(credentials: SavedCredentials): Promise<void> {
    const { entryID = null } = await sendBackgroundMessage({
        sourceID: credentials.sourceID,
        groupID: credentials.groupID,
        entryID: credentials.entryID ?? null,
        entryProperties: {
            password: credentials.password,
            title: credentials.title,
            url: credentials.url,
            username: credentials.username
        },
        entryType: EntryType.Website,
        type: BackgroundMessageType.SaveCredentialsToVault
    });
}
