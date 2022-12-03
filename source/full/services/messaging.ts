import { getExtensionAPI } from "../../shared/extension.js";
import { BackgroundMessage } from "../types.js";

const DEFAULT_TIMEOUT = 15000;

export async function sendBackgroundMessage<T extends {} | void>(
    msg: BackgroundMessage,
    timeout: number = DEFAULT_TIMEOUT
): Promise<T> {
    const browser = getExtensionAPI();
    return new Promise<T>((resolve, reject) => {
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
