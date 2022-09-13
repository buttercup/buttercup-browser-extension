import { getExtensionAPI } from "../extension.js";

const NOOP = () => {};

export async function createNewTab(url: string): Promise<chrome.tabs.Tab> {
    const browser = getExtensionAPI();
    if (!browser.tabs) {
        // Handle non-background scripts
        browser.runtime.sendMessage({ type: "open-tab", url });
        return;
    }
    return new Promise<chrome.tabs.Tab>((resolve) => chrome.tabs.create({ url }, resolve));
}

export function closeCurrentTab() {
    const browser = getExtensionAPI();
    browser.tabs.getCurrent((tab) => {
        browser.tabs.remove(tab.id, NOOP);
    });
}

export async function getCurrentTab(): Promise<chrome.tabs.Tab> {
    const browser = getExtensionAPI();
    return new Promise((resolve) => {
        browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs[0]);
        });
    });
}

export function getExtensionURL(path: string): string {
    return getExtensionAPI().runtime.getURL(path);
}

export async function sendTabMessage(tabID: number, message: any) {
    return new Promise((resolve) => {
        chrome.tabs.sendMessage(tabID, message, (response) => {
            resolve(response);
        });
    });
}
