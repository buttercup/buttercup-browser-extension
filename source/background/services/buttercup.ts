import { Credentials, VaultManager, VaultSource, VaultSourceID, VaultSourceStatus } from "buttercup";
import ms from "ms";
import { log } from "./log.js";
import { BrowserStorageInterface, getNonSyncStorage, getSyncStorage } from "./storage/BrowserStorageInterface.js";

let __vaultManager: VaultManager;

export async function addVaultSource(name: string, type: string, sourceCreds: string): Promise<VaultSourceID> {
    const source = new VaultSource(name, type, sourceCreds);
    await __vaultManager.interruptAutoUpdate(async () => {
        await __vaultManager.addSource(source);
    });
    return source.id;
}

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
    log(`initialsed vault manager: ${vm.sources.length} sources available`);
}

export async function removeSource(sourceID: VaultSourceID): Promise<void> {
    await __vaultManager.removeSource(sourceID);
}

export async function unlockAndCreate(sourceID: VaultSourceID, masterPassword: string): Promise<void> {
    const source = __vaultManager.getSourceForID(sourceID);
    await source.unlock(Credentials.fromPassword(masterPassword), {
        initialiseRemote: true
    });
}

export async function unlockSource(sourceID: VaultSourceID, masterPassword: string): Promise<void> {
    const source = __vaultManager.getSourceForID(sourceID);
    if (source.status === VaultSourceStatus.Unlocked) return;
    await source.unlock(Credentials.fromPassword(masterPassword));
}
