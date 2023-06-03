import { getExtensionAPI } from "../extension.js";
import { stringToError } from "../library/error.js";
import { MESSAGE_DEFAULT_TIMEOUT } from "../symbols.js";
import { BackgroundMessage, BackgroundResponse } from "../../popup/types.js";

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
                reject(stringToError(resp.error));
                return;
            }
            resolve(resp as BackgroundResponse);
        });
    });
}
