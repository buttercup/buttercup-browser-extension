import { getSyncValue, setSyncValue } from "./storage.js";
import { SyncStorageItem } from "../types.js";

export async function disableLoginsOnDomain(domain: string): Promise<void> {
    const currentDomains = new Set(await getDisabledDomains());
    currentDomains.add(domain);
    await setSyncValue(SyncStorageItem.DisabledDomains, JSON.stringify([...currentDomains]));
}

export async function getDisabledDomains(): Promise<Array<string>> {
    const currentDomainsRaw = await getSyncValue(SyncStorageItem.DisabledDomains);
    return currentDomainsRaw ? JSON.parse(currentDomainsRaw) : [];
}

export async function removeDisabledFlagForDomain(domain: string): Promise<void> {
    const currentDomains = new Set(await getDisabledDomains());
    currentDomains.delete(domain);
    await setSyncValue(SyncStorageItem.DisabledDomains, JSON.stringify([...currentDomains]));
}
