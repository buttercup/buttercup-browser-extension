import ExpiryMap from "expiry-map";
import { UsedCredentials } from "../types.js";

interface LoginMemoryItem {
    credentials: UsedCredentials;
    promptSave: boolean;
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

export function stopPromptForTab(tabID: number): void {
    const memory = getLoginMemory();
    let existing: LoginMemoryItem;
    for (const [, item] of memory.entries()) {
        if (item.tabID === tabID) {
            existing = item;
            break;
        }
    }
    if (existing) {
        memory.set(existing.credentials.id, {
            ...existing,
            promptSave: false
        });
    }
}

export function updateUsedCredentials(credentials: UsedCredentials, tabID: number): void {
    const memory = getLoginMemory();
    const existing = memory.get(credentials.id);
    const payload: LoginMemoryItem = {
        credentials,
        promptSave: existing ? existing.promptSave : true,
        tabID
    };
    memory.set(credentials.id, payload);
    memory.set("last", payload);
}
