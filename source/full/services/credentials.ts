import { Layerr } from "layerr";
import { sendBackgroundMessage } from "../../shared/services/messaging.js";
import { BackgroundMessageType, UsedCredentials } from "../types.js";

export async function getCredentials(): Promise<Array<UsedCredentials>> {
    const resp = await sendBackgroundMessage({
        type: BackgroundMessageType.GetSavedCredentials
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed fetching used credentials");
    }
    return resp.credentials;
}
