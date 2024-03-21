import { SearchResult } from "buttercup";
import { Layerr } from "layerr";
import { sendBackgroundMessage } from "../../shared/services/messaging.js";
import { BackgroundMessageType } from "../types.js";

export async function openPageForEntry(item: SearchResult, autoLogin: boolean): Promise<boolean> {
    const resp = await sendBackgroundMessage({
        autoLogin,
        entry: item,
        type: BackgroundMessageType.OpenEntryPage
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed opening page");
    }
    return resp.opened;
}
