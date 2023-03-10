import { getExtensionAPI } from "../../shared/extension.js";
import { MESSAGE_DEFAULT_TIMEOUT } from "../../shared/symbols.js";
import { BackgroundMessage, BackgroundResponse } from "../types.js";

export async function sendBackgroundMessage(
    msg: BackgroundMessage,
    timeout: number = MESSAGE_DEFAULT_TIMEOUT
): Promise<BackgroundResponse> {
    const browser = getExtensionAPI();
    return new Promise<BackgroundResponse>((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Timed out waiting for response to message: ${msg.type} (${timeout} ms)`));
        }, timeout);
        browser.runtime.sendMessage(msg, (resp) => {
            clearTimeout(timer);
            if (resp.error) {
                reject(resp.error);
                return;
            }
            resolve(resp as BackgroundResponse);
        });
    });
}
