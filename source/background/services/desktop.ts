import { BrowserStorageInterface, getNonSyncStorage } from "./storage/BrowserStorageInterface.js";
import { STORAGE_KEY_DESKTOP_CONNECTION } from "../../shared/symbols.js";

export async function hasConnection(): Promise<boolean> {
    const storage = new BrowserStorageInterface(getNonSyncStorage());
    const connRaw = await storage.getValue(STORAGE_KEY_DESKTOP_CONNECTION);
    return !!connRaw;
}
