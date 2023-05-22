import { Layerr } from "layerr";
import joinURL from "url-join";
import { DESKTOP_API_PORT } from "../../../shared/symbols.js";

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
    let url = joinURL(DESKTOP_URL_BASE, route);
    const requestConfig: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
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
        }
    }
    if (auth !== null) {
        requestConfig.headers["Authorization"] = `Bearer ${auth}`;
    }
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
    if (/application\/json/.test(resp.headers.get("Content-Type"))) {
        return resp.json();
    }
    return resp.text();
}
