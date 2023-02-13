import { VaultSourceID } from "buttercup";
import { Layerr } from "layerr";
import { BackgroundMessageType } from "../types.js";
import { sendBackgroundMessage } from "./messaging.js";

export async function unlockSource(sourceID: VaultSourceID, password: string): Promise<void> {
    const resp = await sendBackgroundMessage<{
        error?: Error;
    }>({
        type: BackgroundMessageType.UnlockSource,
        sourceID,
        password
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed to unlock source");
    }
}
