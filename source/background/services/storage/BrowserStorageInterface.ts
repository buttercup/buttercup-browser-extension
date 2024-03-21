import { StorageInterface } from "buttercup";
import { getExtensionAPI } from "../../../shared/extension.js";

export function getSyncStorage() {
    return getExtensionAPI().storage.sync;
}

export function getNonSyncStorage() {
    return getExtensionAPI().storage.local;
}

export class BrowserStorageInterface extends StorageInterface {
    protected _storage: chrome.storage.StorageArea;

    constructor(storage: chrome.storage.StorageArea = getSyncStorage()) {
        super();
        this._storage = storage;
    }

    get storage() {
        return this._storage;
    }

    async getAllKeys() {
        return new Promise<Array<string>>((resolve) => {
            this.storage.get(null, (allItems) => {
                resolve(Object.keys(allItems));
            });
        });
    }

    async getValue(name: string) {
        return new Promise<string>((resolve) => {
            this.storage.get(name, (items) => {
                resolve(items[name]);
            });
        });
    }

    async removeKey(name: string) {
        return new Promise<void>((resolve) => {
            this.storage.remove(name, () => resolve());
        });
    }

    async setValue(name: string, value: any) {
        return new Promise<void>((resolve) => {
            this.storage.set({ [name]: value }, () => resolve());
        });
    }
}
