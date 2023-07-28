import { Layerr } from "layerr";
import { SearchResult, VaultSourceID } from "buttercup";
import { getLocalValue } from "../storage.js";
import { sendDesktopRequest } from "./request.js";
import { LocalStorageItem, OTP, VaultSourceDescription, VaultsTree } from "../../types.js";

export async function authenticateBrowserAccess(code: string): Promise<string> {
    const { token } = (await sendDesktopRequest({
        method: "POST",
        route: "/v1/auth/response",
        payload: {
            code
        }
    })) as { token: string };
    if (!token) {
        throw new Layerr("No token received from browser authentication");
    }
    return token;
}

export async function getOTPs(): Promise<Array<OTP>> {
    const authToken = await getLocalValue(LocalStorageItem.DesktopToken);
    if (!authToken) {
        throw new Layerr(
            {
                info: {
                    i18n: "error.code.desktop-connection-not-authorised"
                }
            },
            "Desktop connection not authorised"
        );
    }
    const { otps } = (await sendDesktopRequest({
        method: "GET",
        route: "/v1/otps",
        auth: authToken
    })) as {
        otps: Array<OTP>;
    };
    return otps;
}

export async function getVaultSources(): Promise<Array<VaultSourceDescription>> {
    const authToken = await getLocalValue(LocalStorageItem.DesktopToken);
    if (!authToken) {
        throw new Layerr(
            {
                info: {
                    i18n: "error.code.desktop-connection-not-authorised"
                }
            },
            "Desktop connection not authorised"
        );
    }
    const { sources } = (await sendDesktopRequest({
        method: "GET",
        route: "/v1/vaults",
        auth: authToken
    })) as {
        sources: Array<VaultSourceDescription>;
    };
    return sources;
}

export async function getVaultsTree(): Promise<VaultsTree> {
    const authToken = await getLocalValue(LocalStorageItem.DesktopToken);
    if (!authToken) {
        throw new Layerr(
            {
                info: {
                    i18n: "error.code.desktop-connection-not-authorised"
                }
            },
            "Desktop connection not authorised"
        );
    }
    const { tree } = (await sendDesktopRequest({
        method: "GET",
        route: "/v1/vaults-tree",
        auth: authToken
    })) as {
        tree: VaultsTree;
    };
    return tree;
}

export async function hasConnection(): Promise<boolean> {
    const token = await getLocalValue(LocalStorageItem.DesktopToken);
    return !!token;
}

export async function initiateConnection(): Promise<void> {
    await sendDesktopRequest({
        method: "POST",
        route: "/v1/auth/request",
        payload: {
            client: "browser",
            purpose: "vaults-access",
            rev: 1
        }
    });
}

export async function promptSourceLock(sourceID: VaultSourceID): Promise<boolean> {
    const authToken = await getLocalValue(LocalStorageItem.DesktopToken);
    if (!authToken) {
        throw new Layerr(
            {
                info: {
                    i18n: "error.code.desktop-connection-not-authorised"
                }
            },
            "Desktop connection not authorised"
        );
    }
    const status = await sendDesktopRequest({
        method: "POST",
        route: `/v1/vaults/${sourceID}/lock`,
        auth: authToken,
        output: "status"
    });
    return status === 200;
}

export async function promptSourceUnlock(sourceID: VaultSourceID): Promise<void> {
    const authToken = await getLocalValue(LocalStorageItem.DesktopToken);
    if (!authToken) {
        throw new Layerr(
            {
                info: {
                    i18n: "error.code.desktop-connection-not-authorised"
                }
            },
            "Desktop connection not authorised"
        );
    }
    await sendDesktopRequest({
        method: "POST",
        route: `/v1/vaults/${sourceID}/unlock`,
        auth: authToken
    });
}

export async function searchEntriesByURL(url: string): Promise<Array<SearchResult>> {
    const authToken = await getLocalValue(LocalStorageItem.DesktopToken);
    if (!authToken) {
        throw new Layerr(
            {
                info: {
                    i18n: "error.code.desktop-connection-not-authorised"
                }
            },
            "Desktop connection not authorised"
        );
    }
    const { results } = (await sendDesktopRequest({
        method: "GET",
        route: "/v1/entries",
        payload: {
            type: "url",
            url
        },
        auth: authToken
    })) as {
        results: Array<SearchResult>;
    };
    return results;
}

export async function searchEntriesByTerm(term: string): Promise<Array<SearchResult>> {
    const authToken = await getLocalValue(LocalStorageItem.DesktopToken);
    if (!authToken) {
        throw new Layerr(
            {
                info: {
                    i18n: "error.code.desktop-connection-not-authorised"
                }
            },
            "Desktop connection not authorised"
        );
    }
    const { results } = (await sendDesktopRequest({
        method: "GET",
        route: "/v1/entries",
        payload: {
            type: "term",
            term
        },
        auth: authToken
    })) as {
        results: Array<SearchResult>;
    };
    return results;
}

export async function testAuth(): Promise<void> {
    const authToken = await getLocalValue(LocalStorageItem.DesktopToken);
    if (!authToken) {
        throw new Layerr(
            {
                info: {
                    i18n: "error.code.desktop-connection-not-authorised"
                }
            },
            "Desktop connection not authorised"
        );
    }
    try {
        await sendDesktopRequest({
            method: "POST",
            route: "/v1/auth/test",
            payload: {
                client: "browser",
                purpose: "vaults-access",
                rev: 1
            },
            auth: authToken
        });
    } catch (err) {
        console.error(err);
        throw new Layerr(err, "Desktop connection failed");
    }
}
