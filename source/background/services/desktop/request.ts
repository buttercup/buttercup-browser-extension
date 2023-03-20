import { Layerr } from "layerr";
import joinURL from "url-join";
import { DESKTOP_API_PORT } from "../../../shared/symbols.js";

const DESKTOP_URL_BASE = `http://localhost:${DESKTOP_API_PORT}`;

export async function sendDesktopRequest(
    method: string,
    route: string,
    payload: Record<string, any> = null,
    auth: string = null
): Promise<string | Record<string, any>> {
    let url = joinURL(DESKTOP_URL_BASE, route);
    const config: RequestInit = {
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
            config.body = JSON.stringify(payload);
        }
    }
    if (auth !== null) {
        config.headers["Authorization"] = `Bearer ${auth}`;
    }
    const resp = await fetch(url, config);
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
    if (/application\/json/.test(resp.headers.get("Content-Type"))) {
        return resp.json();
    }
    return resp.text();
}
