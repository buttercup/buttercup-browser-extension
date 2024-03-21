import { Layerr } from "layerr";
import { sendBackgroundMessage } from "../../shared/services/messaging.js";
import { BackgroundMessageType, VaultsTree } from "../types.js";

export async function getVaultsTree(): Promise<VaultsTree> {
    const resp = await sendBackgroundMessage({
        type: BackgroundMessageType.GetDesktopVaultsTree
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed fetching vaults tree");
    }
    return resp.vaultsTree;
}
