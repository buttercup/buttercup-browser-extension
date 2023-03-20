import { log } from "./log.js";
import { BrowserStorageInterface, getNonSyncStorage, getSyncStorage } from "./storage/BrowserStorageInterface.js";
import { LocalStorageItem } from "../types.js";

const VALID_LOCAL_KEYS = [LocalStorageItem.DesktopToken];
const VALID_SYNC_KEYS = [];

function getLocalStorage(): BrowserStorageInterface {
    return new BrowserStorageInterface(getNonSyncStorage());
}

export async function getLocalValue(key: LocalStorageItem): Promise<string | null> {
    return getLocalStorage().getValue(key) ?? null;
}

function getSynchronisedStorage(): BrowserStorageInterface {
    return new BrowserStorageInterface(getSyncStorage());
}

export async function initialise() {
    const localStorage = getLocalStorage();
    {
        const keys = await localStorage.getAllKeys();
        for (const key of keys) {
            const valid = VALID_LOCAL_KEYS.find((local) => key === local || key.indexOf(local) === 0);
            if (!valid) {
                log(`remove unrecognised local storage key: ${key}`);
                await localStorage.removeKey(key);
            }
        }
    }
    const syncStorage = getSynchronisedStorage();
    {
        const keys = await syncStorage.getAllKeys();
        for (const key of keys) {
            const valid = VALID_SYNC_KEYS.find((local) => key === local || key.indexOf(local) === 0);
            if (!valid) {
                log(`remove unrecognised sync storage key: ${key}`);
                await syncStorage.removeKey(key);
            }
        }
    }
}

export async function removeLocalValue(key: LocalStorageItem): Promise<void> {
    await getLocalStorage().removeKey(key);
}

export async function setLocalValue(key: LocalStorageItem, value: string): Promise<void> {
    return getLocalStorage().setValue(key, value);
}
