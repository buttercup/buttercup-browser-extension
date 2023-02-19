import { Credentials, VaultLiveSnapshot, VaultManager, VaultSource, VaultSourceID, VaultSourceStatus } from "buttercup";
import ms from "ms";
import { getVaultsAppliance } from "./vaultsAppliance.js";
import { describeSource } from "../library/vaultSource.js";
import { log } from "./log.js";
import { BrowserStorageInterface, getNonSyncStorage, getSyncStorage } from "./storage/BrowserStorageInterface.js";

const SNAPSHOT_STORAGE_PREFIX = "bcup:vaultsnapshot:";

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
    const vaultsAppliance = getVaultsAppliance();
    vm.on("sourcesUpdated", () => {
        vaultsAppliance.setProperty(
            "vaults",
            vm.sources.map((source) => describeSource(source))
        );
        storeVaultLiveSnapshots(vm);
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
    await restoreVaultLiveSnapshots();
}

export async function lockSource(sourceID: VaultSourceID): Promise<void> {
    const source = __vaultManager.getSourceForID(sourceID);
    if (source.status === VaultSourceStatus.Unlocked) {
        await source.lock();
    }
}

export async function removeSource(sourceID: VaultSourceID): Promise<void> {
    await lockSource(sourceID);
    await __vaultManager.removeSource(sourceID);
}

async function restoreVaultLiveSnapshots(): Promise<void> {
    const storage = new BrowserStorageInterface(getNonSyncStorage());
    const allKeys = await storage.getAllKeys();
    const keys = allKeys.filter((key) => key.indexOf(`${SNAPSHOT_STORAGE_PREFIX}1a`) === 0);
    const snapshots: Array<VaultLiveSnapshot> = [];
    for (const key of keys) {
        const rawPayload = await storage.getValue(key);
        const payload = JSON.parse(rawPayload);
        // await storage.removeKey(key);
        snapshots.push(payload);
    }
    if (snapshots.length > 0) {
        log(`restoring ${snapshots.length} vault live snapshots`);
        await __vaultManager.restoreLiveSnapshots(snapshots);
    }
}

function storeVaultLiveSnapshots(vaultManager = __vaultManager): void {
    log("storing vault snapshots");
    const snapshots = vaultManager.getLiveSnapshots();
    if (snapshots.length <= 0) {
        log("no snapshots available to store");
        return;
    }
    const rawStorage = getNonSyncStorage();
    rawStorage.set(
        snapshots.reduce(
            (output, snapshot) => ({
                ...output,
                [`${SNAPSHOT_STORAGE_PREFIX}${snapshot.version}:${snapshot.sourceID}`]: JSON.stringify(snapshot)
            }),
            {}
        )
    );
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
