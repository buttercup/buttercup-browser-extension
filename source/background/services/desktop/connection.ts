import { sendDesktopRequest } from "./request.js";
import { Layerr } from "layerr";
import { getLocalValue } from "../storage.js";
import { LocalStorageItem } from "../../types.js";

export async function authenticateBrowserAccess(code: string): Promise<string> {
    const { token } = (await sendDesktopRequest("POST", "/v1/auth/response", {
        code
    })) as { token: string };
    if (!token) {
        throw new Layerr("No token received from browser authentication");
    }
    return token;
}

export async function hasConnection(): Promise<boolean> {
    const token = await getLocalValue(LocalStorageItem.DesktopToken);
    // const storage = new BrowserStorageInterface(getNonSyncStorage());
    // const connRaw = await storage.getValue(STORAGE_KEY_DESKTOP_CONNECTION);
    return !!token;
}

export async function initiateConnection(): Promise<void> {
    await sendDesktopRequest("POST", "/v1/auth/request", {
        client: "browser",
        purpose: "vaults-access",
        rev: 1
    });
}
