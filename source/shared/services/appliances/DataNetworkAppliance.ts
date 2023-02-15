import EventEmitter from "eventemitter3";
import { ulid } from "ulidx";
import { naiveClone } from "../../library/clone.js";
import { Logger } from "../../library/log.js";
import { MESSAGE_DEFAULT_TIMEOUT } from "../../symbols.js";

export interface ApplianceEvents<T extends Record<string, any>> {
    fetchedAll: () => void;
    updated: (key: keyof T | null) => void;
}

type ApplianceMessage<T extends Record<string, any>, K extends keyof T> =
    | {
          data: T;
          for: string;
          id: string;
          type: ApplianceMessageType.BackgroundPayload;
      }
    | {
          id: string;
          type: ApplianceMessageType.SyncFromBackground;
      }
    | {
          id: string;
          key: K;
          type: ApplianceMessageType.SetProperty;
          value: T[K];
      };

enum ApplianceMessageType {
    BackgroundPayload = "background-dataset-payload",
    SetProperty = "set-property",
    SyncFromBackground = "sync-background"
}

export class DataNetworkAppliance<T extends Record<string, any>> extends EventEmitter<ApplianceEvents<T>> {
    protected _dataset: T;
    protected _log: Logger;
    private __channel: BroadcastChannel;
    private __id: string;
    private __initialised: boolean = false;

    constructor(channel: string, initial: T, log: Logger) {
        super();
        this._dataset = initial;
        this._log = log;
        this.__id = ulid();
        this.__channel = new BroadcastChannel(`buttercup:${channel}`);
    }

    get id(): string {
        return this.__id;
    }

    get isBackground(): boolean {
        return global.background === true;
    }

    getProperty<K extends keyof T>(key: K): T[K] {
        return this._dataset[key];
    }

    async initialise() {
        if (this.__initialised) return;
        this.__initialised = true;
        this.__attachListeners();
        this._log(`data appliance: listening for client: ${this.id}`);
    }

    setProperty<K extends keyof T>(key: K, value: T[K]): void {
        this._dataset[key] = value;
        this.emit("updated", null);
        this._transmitEvent({
            id: this.id,
            type: ApplianceMessageType.SetProperty,
            key,
            value
        });
    }

    protected async _syncFromBackground(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(
                    new Error(
                        `Timed out waiting for response to message: ${ApplianceMessageType.SyncFromBackground} (${MESSAGE_DEFAULT_TIMEOUT} ms)`
                    )
                );
            }, MESSAGE_DEFAULT_TIMEOUT);
            this.once("fetchedAll", () => {
                clearTimeout(timeout);
                resolve();
            });
            this._transmitEvent({
                id: this.id,
                type: ApplianceMessageType.SyncFromBackground
            });
        });
    }

    protected _transmitEvent(message: ApplianceMessage<T, keyof T>): void {
        this.__channel.postMessage(message);
    }

    private __attachListeners() {
        this.__channel.addEventListener("message", (event: MessageEvent<ApplianceMessage<T, keyof T>>) => {
            if (event.data.id === this.id) return;
            switch (event.data.type) {
                case ApplianceMessageType.BackgroundPayload: {
                    if (event.data.for === this.id) {
                        this._dataset = event.data.data;
                        this._log(`data appliance: updated dataset from background: ${event.data.id}`);
                        this.emit("updated", null);
                        this.emit("fetchedAll");
                    }
                    break;
                }
                case ApplianceMessageType.SetProperty: {
                    this._dataset[event.data.key] = event.data.value;
                    this.emit("updated", event.data.key);
                    break;
                }
                case ApplianceMessageType.SyncFromBackground: {
                    if (this.isBackground) {
                        this._log(`data appliance: full update requested: ${event.data.id}`);
                        this._transmitEvent({
                            data: naiveClone(this._dataset),
                            for: event.data.id,
                            id: this.id,
                            type: ApplianceMessageType.BackgroundPayload
                        });
                    }
                    break;
                }
            }
        });
    }
}
