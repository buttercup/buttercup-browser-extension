import { SearchResult, VaultSourceID } from "buttercup";
import { Layerr } from "layerr";
import { sendBackgroundMessage } from "../../shared/services/messaging.js";
import { BackgroundMessageType, OTP, VaultSourceDescription } from "../types.js";

export async function clearDesktopConnectionAuth(): Promise<void> {
    const resp = await sendBackgroundMessage({
        type: BackgroundMessageType.ClearDesktopAuthentication
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed clearing desktop authentication");
    }
}

export async function getDesktopConnectionAvailable(): Promise<boolean> {
    const resp = await sendBackgroundMessage({
        type: BackgroundMessageType.CheckDesktopConnection
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed checking desktop connection availability");
    }
    return resp.available ?? false;
}

export async function getOTPs(): Promise<Array<OTP>> {
    const resp = await sendBackgroundMessage({
        type: BackgroundMessageType.GetOTPs
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed fetching OTPs from desktop application");
    }
    return resp.otps ?? [];
}

export async function getRecentEntries(): Promise<Array<SearchResult>> {
    const resp = await sendBackgroundMessage({
        count: 5,
        type: BackgroundMessageType.GetRecentEntries
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed fetching recent entries from desktop application");
    }
    return resp.searchResults ?? [];
}

export async function getVaultSources(): Promise<Array<VaultSourceDescription>> {
    const resp = await sendBackgroundMessage({
        type: BackgroundMessageType.GetDesktopVaultSources
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed fetching vaults from desktop application");
    }
    return resp.vaultSources ?? [];
}

export async function initiateDesktopConnectionRequest(): Promise<void> {
    const resp = await sendBackgroundMessage({
        type: BackgroundMessageType.InitiateDesktopConnection
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed initiating desktop connection");
    }
}

export async function promptLockVault(sourceID: VaultSourceID): Promise<boolean> {
    const resp = await sendBackgroundMessage({
        sourceID,
        type: BackgroundMessageType.PromptLockSource
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed locking vault");
    }
    return !!resp.locked;
}

export async function promptUnlockVault(sourceID: VaultSourceID): Promise<void> {
    const resp = await sendBackgroundMessage({
        sourceID,
        type: BackgroundMessageType.PromptUnlockSource
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed prompting vault unlock");
    }
}

export async function searchEntriesByTerm(term: string): Promise<Array<SearchResult>> {
    const resp = await sendBackgroundMessage({
        searchTerm: term,
        type: BackgroundMessageType.SearchEntriesByTerm
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed fetching search results from desktop application");
    }
    return resp.searchResults ?? [];
}

export async function searchEntriesByURL(url: string): Promise<Array<SearchResult>> {
    const resp = await sendBackgroundMessage({
        type: BackgroundMessageType.SearchEntriesByURL,
        url
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed fetching URL results from desktop application");
    }
    return resp.searchResults ?? [];
}
