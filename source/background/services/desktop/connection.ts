import { Layerr } from "layerr";
import { SearchResult } from "buttercup";
import { getLocalValue } from "../storage.js";
import { sendDesktopRequest } from "./request.js";
import { LocalStorageItem, VaultSourceDescription } from "../../types.js";

export async function authenticateBrowserAccess(code: string): Promise<string> {
    const { token } = (await sendDesktopRequest("POST", "/v1/auth/response", {
        code
    })) as { token: string };
    if (!token) {
        throw new Layerr("No token received from browser authentication");
    }
    return token;
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
    const { sources } = (await sendDesktopRequest("GET", "/v1/vaults", null, authToken)) as {
        sources: Array<VaultSourceDescription>;
    };
    return sources;
}

export async function hasConnection(): Promise<boolean> {
    const token = await getLocalValue(LocalStorageItem.DesktopToken);
    return !!token;
}

export async function initiateConnection(): Promise<void> {
    await sendDesktopRequest("POST", "/v1/auth/request", {
        client: "browser",
        purpose: "vaults-access",
        rev: 1
    });
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
    const { results } = (await sendDesktopRequest(
        "GET",
        "/v1/entries",
        {
            type: "term",
            term
        },
        authToken
    )) as {
        results: Array<SearchResult>;
    };
    return results;
}
