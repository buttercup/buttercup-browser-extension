import BrowserStorageInterface, { getSyncStorage } from "./BrowserStorageInterface.js";

const STORAGE_KEY_DOMAINS = "disabledLoginDomains";

export async function disableLoginsOnDomain(domain) {
    const storage = new BrowserStorageInterface(getSyncStorage());
    const currentlyDisabled = await getDisabledDomains();
    await storage.setValue(STORAGE_KEY_DOMAINS, JSON.stringify([...new Set([...currentlyDisabled, domain])]));
}

export async function getDisabledDomains() {
    const storage = new BrowserStorageInterface(getSyncStorage());
    const itemsJSON = await storage.getValue(STORAGE_KEY_DOMAINS);
    try {
        const items = JSON.parse(itemsJSON);
        return Array.isArray(items) ? items : [];
    } catch (err) {}
    return [];
}

export async function removeDisabledFlagForDomain(domain) {
    const storage = new BrowserStorageInterface(getSyncStorage());
    const domains = await getDisabledDomains();
    await storage.setValue(STORAGE_KEY_DOMAINS, JSON.stringify(domains.filter(d => d !== domain)));
}
