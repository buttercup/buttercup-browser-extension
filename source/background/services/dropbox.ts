import { generateAuthorisationURL } from "@buttercup/dropbox-client";
import ms from "ms";
import { getExtensionAPI } from "../../shared/extension.js";
import { createNewTab } from "../../shared/library/extension.js";
import { getEmitter } from "./browser.js";
import { log } from "./log.js";

const DROPBOX_CALLBACK_URL = "https://buttercup.pw/";
const DROPBOX_CLIENT_ID = "5fstmwjaisrt06t";
const TIMEOUT = ms("2m");

export async function authenticate(): Promise<string> {
    const url = generateAuthorisationURL(DROPBOX_CLIENT_ID, DROPBOX_CALLBACK_URL);
    const tab = await createNewTab(url);
    return new Promise<string>((resolve, reject) => {
        const eventEmitter = getEmitter();
        const browser = getExtensionAPI();
        let tabClosed = false;
        const onCancel = () => {
            log("dropbox auth failed");
            clearTimeout(timer);
            eventEmitter.off("tabClosed", onTabClosed);
            eventEmitter.off("dropboxToken", onToken);
            if (!tabClosed && tab) browser.tabs.remove(tab.id);
            reject(new Error("Failed authenticating Dropbox"));
        };
        const onTabClosed = ({ tabID }: { tabID: number }) => {
            if (tab && tabID === tab.id) {
                log("dropbox auth tab closed");
                tabClosed = true;
                onCancel();
            }
        };
        const onToken = ({ token }: { token: string }) => {
            clearTimeout(timer);
            eventEmitter.off("tabClosed", onTabClosed);
            // Tab is already removed by browser service
            // if (!tabClosed && tab) browser.tabs.remove(tab.id);
            resolve(token);
        };
        eventEmitter.once("dropboxToken", onToken);
        eventEmitter.on("tabClosed", onTabClosed);
        const timer = setTimeout(() => {
            log("dropbox auth timed-out, cancelling");
            onCancel();
        }, TIMEOUT);
    });
}
