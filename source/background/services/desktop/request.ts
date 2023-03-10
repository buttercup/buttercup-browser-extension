import { Layerr } from "layerr";
import joinURL from "url-join";
import { DESKTOP_API_PORT } from "../../../shared/symbols.js";

const DESKTOP_URL_BASE = `http://localhost:${DESKTOP_API_PORT}`;

export async function sendDesktopRequest(
    method: string,
    route: string,
    payload: Record<string, any> = {}
): Promise<string | Record<string, any>> {
    const url = joinURL(DESKTOP_URL_BASE, route);
    const resp = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    if (!resp.ok) {
        throw new Layerr(
            {
                info: {
                    code: "desktop-request-failed",
                    status: resp.status,
                    statusText: resp.statusText
                }
            },
            `Desktop request failed: ${resp.statusText}`
        );
    }
    if (/application\/json/.test(resp.headers.get("Content-Type"))) {
        return resp.json();
    }
    return resp.text();
}
