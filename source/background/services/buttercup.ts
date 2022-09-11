import { VaultManager, VaultSource } from "buttercup";
import ms from "ms";
import { log } from "./log.js";
import { BrowserStorageInterface, getNonSyncStorage, getSyncStorage } from "./storage/BrowserStorageInterface.js";

let __vaultManager: VaultManager;

export async function initialiseVaultManager() {
    const vm = new VaultManager({
        autoUpdate: true,
        autoUpdateDelay: ms("2m"),
        cacheStorage: new BrowserStorageInterface(getNonSyncStorage()),
        sourceStorage: new BrowserStorageInterface(getSyncStorage())
    });

    vm.initialise();
    await vm.rehydrate();
    __vaultManager = vm;
    vm.on("autoUpdateFailed", ({ source }) => {
        log(`auto-update failed for source: ${source.id} (${source.name})`);
    });
    vm.on("autoUpdateStop", () => {
        log("auto-update completed");
    });
    log("initialsed vault manager");
}
