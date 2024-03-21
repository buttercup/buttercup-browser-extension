import { Layerr } from "layerr";
import { sendBackgroundMessage } from "../../shared/services/messaging.js";
import { BackgroundMessageType } from "../types.js";

export async function disableDomainForLogin(loginID: string): Promise<void> {
    const resp = await sendBackgroundMessage({
        credentialsID: loginID,
        type: BackgroundMessageType.DisableSavePromptForCredentials
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed disabling save prompt for login");
    }
}
