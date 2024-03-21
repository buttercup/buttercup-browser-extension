import { Layerr } from "layerr";
import { sendBackgroundMessage } from "../../shared/services/messaging.js";
import { BackgroundMessageType } from "../types.js";

export async function resetApplicationSettings(): Promise<void> {
    const resp = await sendBackgroundMessage({
        type: BackgroundMessageType.ResetSettings
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed resetting settings");
    }
}
