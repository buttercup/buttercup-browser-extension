import ChannelQueue from "@buttercup/channel-queue";
import { configureRaw as configure } from "@buttercup/config";
import merge from "merge";
import debounce from "debounce";
import hashObject from "object-hash";
import BrowserStorageInterface from "./BrowserStorageInterface.js";
import { INITIAL_CONFIG } from "../../shared/library/config.js";
import { dispatch, getState } from "../redux/index.js";
import { setConfig } from "../../shared/actions/app.js";
import { getConfig, getConfigSource } from "../../shared/selectors/app.js";
import log from "../../shared/library/log.js";

const queue = new ChannelQueue();
let lastConfigHash = "";

function loadConfigFromStorage(storageInstance) {
    return queue.channel("storage").enqueue(() => {
        log.info("Storage updated - loading configuration");
        return storageInstance.getValue("bcup_extension_config").then(configRaw => {
            const state = getState();
            const configFromStorage = JSON.parse(configRaw || "{}");
            const config = merge.recursive({}, getConfig(state), configFromStorage);
            const configInst = configure(config, INITIAL_CONFIG);
            configInst.apply();
            const incomingHash = hashObject(config);
            if (incomingHash === lastConfigHash) {
                log.info(`Config from storage matches memory - no update necessary: ${lastConfigHash}`);
                return;
            }
            lastConfigHash = incomingHash;
            log.info(`Config loaded from storage: ${lastConfigHash}`);
            dispatch(
                setConfig({
                    config,
                    source: "storage"
                })
            );
        });
    });
}

function syncConfigToStorage(storageInstance) {
    const state = getState();
    const currentConfig = getConfig(state);
    const source = getConfigSource(state);
    if (source === "storage") {
        return;
    }
    const currentHash = hashObject(currentConfig);
    if (currentHash !== lastConfigHash) {
        log.info("Configuration updated - preparing to write to storage");
        queue.channel("storage").enqueue(() => {
            return storageInstance.setValue("bcup_extension_config", JSON.stringify(currentConfig)).then(() => {
                lastConfigHash = currentHash;
                log.info(`Configuration written to storage: ${lastConfigHash}`);
            });
        });
    }
}

export function watchStorage(reduxStore, storageInstance = new BrowserStorageInterface()) {
    const storageTypeUsed = storageInstance.storage === chrome.storage.sync ? "sync" : "local";
    const debouncedLoadConfig = debounce(() => loadConfigFromStorage(storageInstance), 250, /* trailing: */ false);
    const debouncedSyncConfig = debounce(() => syncConfigToStorage(storageInstance), 250, /* trailing: */ false);
    return loadConfigFromStorage(storageInstance).then(() => {
        const state = getState();
        const currentConfig = getConfig(state);
        lastConfigHash = hashObject(currentConfig);
        reduxStore.subscribe(debouncedSyncConfig);
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === storageTypeUsed) {
                debouncedLoadConfig();
            }
        });
    });
}
