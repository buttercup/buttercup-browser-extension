import { SearchResult } from "buttercup";
import ExpiryMap from "expiry-map";

interface RegisteredItem {
    entry: SearchResult;
    tabID: number;
}

const REGISTER_MAX_AGE = 30 * 1000; // 30 seconds

let __register: ExpiryMap<string, RegisteredItem> | null = null;

export function getAutoLoginForTab(tabID: number): SearchResult | null {
    const register = getRegister();
    const key = `tab-${tabID}`;
    if (register.has(key)) {
        const item = (register.get(key) as RegisteredItem).entry;
        register.delete(key);
        return item;
    }
    return null;
}

function getRegister(): ExpiryMap<string, RegisteredItem> {
    if (!__register) {
        __register = new ExpiryMap(REGISTER_MAX_AGE);
    }
    return __register;
}

export function registerAutoLogin(entry: SearchResult, tabID: number): void {
    const register = getRegister();
    register.set(`tab-${tabID}`, { entry, tabID });
}
