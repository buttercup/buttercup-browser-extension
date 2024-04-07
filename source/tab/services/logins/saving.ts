import { Layerr } from "layerr";
import { sendBackgroundMessage } from "../../../shared/services/messaging.js";
import { BackgroundMessageType, UsedCredentials } from "../../types.js";

export async function getCredentialsForID(id: string): Promise<UsedCredentials | null> {
    const resp = await sendBackgroundMessage({
        credentialsID: id,
        type: BackgroundMessageType.GetSavedCredentialsForID
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed fetching saved credentials");
    }
    return resp.credentials?.[0] ?? null;
}

export async function getLastSavedCredentials(): Promise<UsedCredentials | null> {
    const resp = await sendBackgroundMessage({
        type: BackgroundMessageType.GetLastSavedCredentials
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed fetching last saved credentials");
    }
    return resp.credentials?.[0] ?? null;
}

export function transferLoginCredentials(details: UsedCredentials) {
    sendBackgroundMessage({ type: BackgroundMessageType.SaveUsedCredentials, credentials: details }).catch((err) => {
        console.error(err);
    });
}
