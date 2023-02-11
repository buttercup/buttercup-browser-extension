import EventEmitter from "eventemitter3";
import * as _Layerr from "layerr";
import { getExtensionAPI } from "../../extension.js";
import { naiveClone } from "../../library/clone.js";
import { getAllTabs, sendTabMessage } from "../../library/extension.js";
import { MESSAGE_DEFAULT_TIMEOUT } from "../../symbols.js";

const { Layerr } = _Layerr;

export interface ApplianceEvents<T extends Record<string, any>> {
    fetchedAll: () => void;
    updated: (key: keyof T | null) => void;
}

type ApplianceMessage<T extends Record<string, any>, K extends keyof T> =
    | {
          type: ApplianceMessageType.FetchAll;
      }
    | {
          type: ApplianceMessageType.KeyUpdated;
          key: K;
          value: T[K];
      };

enum ApplianceMessageType {
    FetchAll = "fetch-all",
    KeyUpdated = "key-updated"
}

type ApplianceMessageResponse<T> = {
    type: ApplianceMessageType.FetchAll;
    result: T;
};

async function sendBackgroundMessage<B extends {}, T extends Record<string, any>, K extends keyof T>(
    msg: ApplianceMessage<T, K>,
    timeout: number = MESSAGE_DEFAULT_TIMEOUT
): Promise<B> {
    const browser = getExtensionAPI();
    return new Promise<B>((resolve, reject) => {
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

export class DataNetworkAppliance<T extends Record<string, any>> extends EventEmitter<ApplianceEvents<T>> {
    protected _dataset: T;
    private __initialised: boolean = false;

    constructor(initial: T) {
        super();
        this._dataset = initial;
    }

    get isPrimary(): boolean {
        return global.background === true;
    }

    getProperty<K extends keyof T>(key: K): T[K] {
        return this._dataset[key];
    }

    async initialise() {
        if (this.__initialised) return;
        getExtensionAPI().runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.__handleMessage(request, sender, sendResponse).catch((err) => {
                console.error(err);
                sendResponse({
                    error: new Layerr(err, "Appliance task failed")
                });
            });
            return true;
        });
        this.__initialised = true;
    }

    setProperty<K extends keyof T>(key: K, value: T[K]): void {
        this._dataset[key] = value;
        this.emit("updated", null);
        this.__sendMessage({
            type: ApplianceMessageType.KeyUpdated,
            key,
            value
        }).catch((err) => {
            console.error(err);
        });
    }

    protected async _syncFromPrimary(): Promise<void> {
        const { result } = await this.__sendMessage({
            type: ApplianceMessageType.FetchAll
        });
        this._dataset = result;
        this.emit("updated", null);
        this.emit("fetchedAll");
    }

    private async __handleMessage(
        msg: ApplianceMessage<T, any>,
        sender: chrome.runtime.MessageSender,
        sendResponse: (resp: ApplianceMessageResponse<T>) => void
    ): Promise<void> {
        switch (msg.type) {
            case ApplianceMessageType.FetchAll: {
                sendResponse({
                    type: msg.type,
                    result: naiveClone(this._dataset)
                });
                return;
            }
            default:
                // Do nothing
                break;
        }
    }

    private async __sendMessage<K extends keyof T>(
        msg: ApplianceMessage<T, K>
    ): Promise<ApplianceMessageResponse<T> | null> {
        if (global.background === true) {
            // Send to all tabs
            const tabs = await getAllTabs();
            await Promise.all(tabs.map((tab) => sendTabMessage(tab.id, msg)));
            // Don't care about the response
        } else {
            // Send to background
            const resp = await sendBackgroundMessage<ApplianceMessageResponse<T>, T, K>(msg);
            return resp;
        }
        return null;
    }
}
