import ExpiryMap from "expiry-map";
import { UsedCredentials } from "../types.js";

interface LoginMemoryItem {
    credentials: UsedCredentials;
    promptSave: boolean;
    tabID: number;
}

const LOGIN_MAX_AGE = 15 * 60 * 1000; // 15 min

let __loginMemory: ExpiryMap<string, LoginMemoryItem> | null = null;

export function getAllCredentials(): Array<UsedCredentials> {
    const memory = getLoginMemory();
    return [...memory.values()].map((item) => item.credentials);
}

export function getCredentialsForID(id: string): UsedCredentials | null {
    const memory = getLoginMemory();
    return memory.has(id) ? memory.get(id).credentials : null;
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
    memory.set(credentials.id, {
        credentials,
        promptSave: existing ? existing.promptSave : true,
        tabID
    });
}
