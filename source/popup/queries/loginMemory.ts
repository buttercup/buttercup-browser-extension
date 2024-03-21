import { Layerr } from "layerr";
import { sendBackgroundMessage } from "../../shared/services/messaging.js";
import { BackgroundMessageType } from "../types.js";

export async function clearSavedLoginPrompt(loginID: string): Promise<void> {
    const resp = await sendBackgroundMessage({
        credentialsID: loginID,
        type: BackgroundMessageType.ClearSavedCredentialsPrompt
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed clearing saved credentials prompt");
    }
}
