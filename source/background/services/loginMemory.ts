import ExpiryMap from "expiry-map";
import { UsedCredentials } from "../types.js";

interface LoginMemoryItem {
    credentials: UsedCredentials;
    tabID: number;
}

const LOGIN_MAX_AGE = 15 * 60 * 1000; // 15 min

let __loginMemory: ExpiryMap<string, LoginMemoryItem> | null = null;

export function clearCredentials(id: string): void {
    const memory = getLoginMemory();
    if (memory.has(id)) {
        memory.delete(id);
    }
    if (memory.has("last")) {
        const last = memory.get("last");
        if (last.credentials.id === id) {
            memory.delete("last");
        }
    }
}

export function getAllCredentials(): Array<UsedCredentials> {
    const memory = getLoginMemory();
    const credentials: Array<UsedCredentials> = [];
    for (const [key, item] of memory.entries()) {
        if (key === "last") continue;
        credentials.push(item.credentials);
    }
    return credentials;
}

export function getCredentialsForID(id: string): UsedCredentials | null {
    const memory = getLoginMemory();
    return memory.has(id) ? memory.get(id).credentials : null;
}

export function getLastCredentials(tabID: number): UsedCredentials | null {
    const memory = getLoginMemory();
    const last = memory.has("last") ? memory.get("last") : null;
    if (!last) return null;
    return last.tabID === tabID ? last.credentials : null;
}

function getLoginMemory(): ExpiryMap<string, LoginMemoryItem> {
    if (!__loginMemory) {
        __loginMemory = new ExpiryMap(LOGIN_MAX_AGE);
    }
    return __loginMemory;
}

export function stopPromptForID(id: string): void {
    const memory = getLoginMemory();
    if (memory.has(id)) {
        const existing = memory.get(id);
        memory.set(id, {
            ...existing,
            credentials: {
                ...existing.credentials,
                promptSave: false
            }
        });
    }
    const last = memory.has("last") ? memory.get("last") : null;
    if (last?.credentials.id === id) {
        memory.set("last", {
            ...last,
            credentials: {
                ...last.credentials,
                promptSave: false
            }
        });
    }
}

export function updateUsedCredentials(credentials: UsedCredentials, tabID: number): void {
    const memory = getLoginMemory();
    const payload: LoginMemoryItem = {
        credentials,
        tabID
    };
    memory.set(credentials.id, payload);
    memory.set("last", payload);
}
