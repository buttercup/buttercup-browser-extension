import { TASK_TYPE_HIGH_PRIORITY } from "@buttercup/channel-queue";
import log from "../../shared/library/log.js";
import BrowserStorageInterface, { getNonSyncStorage, getSyncStorage } from "./BrowserStorageInterface.js";

export function migrateLocalStorageToChromeStorage(queue) {
    log.info("(Migration)", "Beginning data migration for new storage");
    return queue.channel("archiveManager").enqueue(() => {
        const sourceStorage = new BrowserStorageInterface(getNonSyncStorage());
        const targetStorage = new BrowserStorageInterface(getSyncStorage());
        return sourceStorage
            .getAllKeys()
            .then(keys => keys.filter(key => /^bcup_archivemgr/.test(key)))
            .then(keys => {
                log.info("(Migration)", `Migrating ${keys.length} keys from non-sync to sync`);
                return keys;
            })
            .then(keys =>
                Promise.all(
                    keys.map(key =>
                        sourceStorage
                            .getValue(key)
                            .then(value => targetStorage.setValue(key, value))
                            .then(() => sourceStorage.removeKey(key))
                    )
                )
            )
            .then(() => {
                log.info("(Migration)", "Migration complete");
            });
    }, TASK_TYPE_HIGH_PRIORITY);
}
