import { Layerr } from "layerr";
import { sendBackgroundMessage } from "../../../shared/services/messaging.js";
import { BackgroundMessageType } from "../../types.js";

export async function getDisabledDomains(): Promise<Array<string>> {
    const resp = await sendBackgroundMessage({
        type: BackgroundMessageType.GetDisabledDomains
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed fetching disabled login domains");
    }
    return resp.domains ?? [];
}
