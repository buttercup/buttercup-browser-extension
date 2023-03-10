import { Layerr } from "layerr";
import { sendBackgroundMessage } from "../services/messaging.js";
import { BackgroundMessageType } from "../types.js";

export async function getDesktopConnectionAvailable(): Promise<boolean> {
    const resp = await sendBackgroundMessage({
        type: BackgroundMessageType.CheckDesktopConnection
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed checking desktop connection availability");
    }
    return resp.available;
}

export async function initiateDesktopConnectionRequest(): Promise<void> {
    const resp = await sendBackgroundMessage({
        type: BackgroundMessageType.InitiateDesktopConnection
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed initiating desktop connection");
    }
}
