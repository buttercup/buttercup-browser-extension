import { StorageInterface } from "../../shared/library/buttercup.js";

export function getSyncStorage() {
    return chrome.storage.sync;
}

export function getNonSyncStorage() {
    return chrome.storage.local;
}

export default class BrowserStorageInterface extends StorageInterface {
    constructor(storage = getSyncStorage()) {
        super();
        this._storage = storage;
    }

    get storage() {
        return this._storage;
    }

    getAllKeys() {
        return new Promise(resolve => {
            this.storage.get(null, allItems => {
                resolve(Object.keys(allItems));
            });
        });
    }

    getValue(name) {
        return new Promise(resolve => {
            this.storage.get(name, items => {
                resolve(items[name]);
            });
        });
    }

    removeKey(name) {
        return new Promise(resolve => {
            this.storage.remove(name, () => resolve());
        });
    }

    setValue(name, value) {
        return new Promise(resolve => {
            this.storage.set({ [name]: value }, () => resolve());
        });
    }
}
