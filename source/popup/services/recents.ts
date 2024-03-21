import { SearchResult } from "buttercup";
import { Layerr } from "layerr";
import { sendBackgroundMessage } from "../../shared/services/messaging.js";
import { BackgroundMessageType } from "../types.js";

export async function trackEntryRecentUse(item: SearchResult): Promise<void> {
    const resp = await sendBackgroundMessage({
        entry: item,
        type: BackgroundMessageType.TrackRecentEntry
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed tracking entry use");
    }
}
