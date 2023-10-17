import { getExtensionAPI } from "../extension.js";
import { stringToError } from "../library/error.js";
import { MESSAGE_DEFAULT_TIMEOUT } from "../symbols.js";
import { BackgroundMessage, BackgroundResponse, TabEvent } from "../../popup/types.js";

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

export async function sendTabsMessage(payload: TabEvent, tabIDs: Array<number> | null = null): Promise<void> {
    const browser = getExtensionAPI();
    const targetTabIDs = Array.isArray(tabIDs)
        ? tabIDs
        : (
              await browser.tabs.query({
                  status: "complete"
              })
          ).map((tab) => tab.id);
    await Promise.all(
        targetTabIDs.map(async (tabID) => {
            await browser.tabs.sendMessage(tabID, payload);
        })
    );
}
