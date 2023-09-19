import { Layerr } from "layerr";
import joinURL from "url-join";
import { DESKTOP_API_PORT } from "../../../shared/symbols.js";
import { decryptPayload, encryptPayload } from "../rsaCrypto.js";
import { getLocalValue } from "../storage.js";
import { LocalStorageItem } from "../../types.js";

type OutputType = "body" | "status";

interface DesktopRequestConfig<O extends OutputType> {
    auth?: string | null;
    method: string;
    output?: O;
    payload?: Record<string, any> | null;
    route: string;
}

const DESKTOP_URL_BASE = `http://localhost:${DESKTOP_API_PORT}`;

export async function sendDesktopRequest<O extends undefined>(
    config: DesktopRequestConfig<O>
): Promise<string | Record<string, any>>;
export async function sendDesktopRequest<O extends "status">(config: DesktopRequestConfig<O>): Promise<number>;
export async function sendDesktopRequest<O extends "body">(
    config: DesktopRequestConfig<O>
): Promise<string | Record<string, any>>;
export async function sendDesktopRequest<O extends OutputType>(
    config: DesktopRequestConfig<O>
): Promise<string | Record<string, any> | number> {
    const { auth = null, method, output = "body", payload = null, route } = config;
    // Prepare un-encrypted configuration first
    let url = joinURL(DESKTOP_URL_BASE, route);
    const requestConfig: RequestInit = {
        method,
        headers: {}
    };
    if (payload !== null) {
        if (/^get$/i.test(method)) {
            const newURL = new URL(url);
            for (const prop in payload) {
                if (payload.hasOwnProperty(prop)) {
                    newURL.searchParams.set(prop, payload[prop]);
                }
            }
            url = newURL.toString();
        } else {
            requestConfig.body = JSON.stringify(payload);
            Object.assign(requestConfig.headers, {
                "Content-Type": "application/json"
            });
        }
    }
    if (auth !== null) {
        // Request requires encryption, perform setup now
        requestConfig.headers["Authorization"] = auth;
        if (typeof requestConfig.body === "string") {
            requestConfig.headers["X-Content-Type"] = requestConfig.headers["Content-Type"];
            requestConfig.headers["Content-Type"] = "text/plain";
            // Encrypt
            console.log("ENC");
            const privateKey = await getLocalValue(LocalStorageItem.APIPrivateKey);
            const publicKey = await getLocalValue(LocalStorageItem.APIServerPublicKey);
            requestConfig.body = await encryptPayload(requestConfig.body, privateKey, publicKey);
        }
    }
    // Make request
    const resp = await fetch(url, requestConfig);
    if (!resp.ok) {
        throw new Layerr(
            {
                info: {
                    code: "desktop-request-failed",
                    status: resp.status,
                    statusText: resp.statusText
                }
            },
            `Desktop request failed: ${resp.status} ${resp.statusText}`
        );
    }
    if (output === "status") {
        return resp.status;
    }
    // Handle encrypted response
    if (resp.headers.get("X-Bcup-API")) {
        const components = resp.headers.get("X-Bcup-API").split(",");
        if (components.includes("enc")) {
            const content = await resp.text();
            const contentType = resp.headers.get("X-Content-Type") || resp.headers.get("Content-Type") || "text/plain";
            // Decrypt
            const privateKey = await getLocalValue(LocalStorageItem.APIPrivateKey);
            const publicKey = await getLocalValue(LocalStorageItem.APIServerPublicKey);
            const rawDecrypted = await decryptPayload(content, publicKey, privateKey);
            return /application\/json/.test(contentType) ? JSON.parse(rawDecrypted) : rawDecrypted;
        }
    }
    // Standard, unencrypted response
    if (/application\/json/.test(resp.headers.get("Content-Type"))) {
        return resp.json();
    }
    return resp.text();
}
