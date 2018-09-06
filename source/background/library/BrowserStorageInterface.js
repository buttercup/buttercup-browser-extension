import { storage } from "buttercup/dist/buttercup-web.js";

const { MemoryStorageInterface, StorageInterface } = storage;

export function getDefaultStorageAdapter() {
    return chrome.storage.local;
}

// export default class BrowserStorageInterface extends MemoryStorageInterface {
//     constructor() {
//         super();
//     }
// }

// Edge doesn't like chrome storage for some reason, so this will fail:
export default class BrowserStorageInterface extends StorageInterface {
    constructor() {
        super();
        this._storage = getDefaultStorageAdapter();
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
