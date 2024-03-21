import { Layerr } from "layerr";
import { LocalStorageItem } from "../../types.js";
import { getLocalValue } from "../storage.js";

export async function generateAuthHeader(): Promise<string> {
    const clientID = await getLocalValue(LocalStorageItem.APIClientID);
    if (!clientID) {
        throw new Layerr(
            {
                info: {
                    i18n: "error.code.desktop-connection-not-authorised"
                }
            },
            "No API client ID set"
        );
    }
    return `Client ${clientID}`;
}
