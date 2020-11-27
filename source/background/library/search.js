import { Search } from "../../shared/library/buttercup.js";
import BrowserStorageInterface, { getSyncStorage } from "./BrowserStorageInterface.js";
import { getFacades } from "./archives.js";

let __search = null,
    __facades = [],
    __prepPromise = null;

export async function getCachedFacades() {
    if (__prepPromise) {
        await __prepPromise;
    }
    return __facades;
}

export async function getSearch() {
    if (__prepPromise) {
        await __prepPromise;
    }
    return __search;
}

export async function updateSearch(vaults) {
    if (__prepPromise) {
        await __prepPromise;
        __prepPromise = null;
    }
    const storage = new BrowserStorageInterface(getSyncStorage());
    __search = new Search(vaults, storage);
    __prepPromise = __search.prepare().then(() => {
        // Cache the facades
        __facades = getFacades();
    });
}
