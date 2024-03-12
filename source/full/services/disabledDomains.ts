import { Layerr } from "layerr";
import { sendBackgroundMessage } from "../../shared/services/messaging.js";
import { BackgroundMessageType } from "../types.js";

export async function getDisabledDomains(): Promise<Array<string>> {
    const resp = await sendBackgroundMessage({
        type: BackgroundMessageType.GetDisabledDomains
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed fetching disabled domains");
    }
    return resp.domains;
}

export async function removeDisabledDomain(domain: string): Promise<void> {
    const resp = await sendBackgroundMessage({
        domains: [domain],
        type: BackgroundMessageType.DeleteDisabledDomains
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed removing disabled domains");
    }
}
