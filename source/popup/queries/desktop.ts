import { Layerr } from "layerr";
import { sendBackgroundMessage } from "../services/messaging.js";
import { BackgroundMessageType, VaultSourceDescription } from "../types.js";

export async function getDesktopConnectionAvailable(): Promise<boolean> {
    const resp = await sendBackgroundMessage({
        type: BackgroundMessageType.CheckDesktopConnection
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed checking desktop connection availability");
    }
    return resp.available;
}

export async function getVaultSources(): Promise<Array<VaultSourceDescription>> {
    const resp = await sendBackgroundMessage({
        type: BackgroundMessageType.GetDesktopVaultSources
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed fetching vaults from desktop application");
    }
    return resp.vaultSources;
}

export async function initiateDesktopConnectionRequest(): Promise<void> {
    const resp = await sendBackgroundMessage({
        type: BackgroundMessageType.InitiateDesktopConnection
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed initiating desktop connection");
    }
}
