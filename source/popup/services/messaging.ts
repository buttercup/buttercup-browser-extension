import { getExtensionAPI } from "../../shared/extension.js";
import { MESSAGE_DEFAULT_TIMEOUT } from "../../shared/symbols.js";
import { BackgroundMessage, BackgroundMessageType, BackgroundResponse } from "../types.js";

export async function sendBackgroundMessage<T extends BackgroundMessageType>(
    msg: BackgroundMessage[T],
    timeout: number = MESSAGE_DEFAULT_TIMEOUT
): Promise<BackgroundResponse[T]> {
    const browser = getExtensionAPI();
    return new Promise<BackgroundResponse[T]>((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Timed out waiting for response to message: ${msg.type} (${timeout} ms)`));
        }, timeout);
        browser.runtime.sendMessage(msg, (resp) => {
            clearTimeout(timer);
            if (resp.error) {
                reject(resp.error);
                return;
            }
            resolve(resp);
        });
    });
}
