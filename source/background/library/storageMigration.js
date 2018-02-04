import { TASK_TYPE_HIGH_PRIORITY } from "@buttercup/channel-queue";
import log from "../../shared/library/log.js";
import { getDefaultStorageAdapter } from "./BrowserStorageInterface.js";

export function migrateLocalStorageToChromeStorage(queue) {
    log.info("(Migration)", "Beginning data migration for new storage");
    return queue
        .channel("archiveManager")
        .enqueue(() => {
            const browserStorage = getDefaultStorageAdapter();
            const payload = Object.keys(window.localStorage).reduce(
                (current, key) => ({
                    ...current,
                    [key]: window.localStorage[key]
                }),
                {}
            );
            log.info("(Migration)", `Migrating ${Object.keys(payload).length} keys`);
            return new Promise(resolve => {
                browserStorage.set(payload, resolve);
            });
        }, TASK_TYPE_HIGH_PRIORITY)
        .then(() => {
            log.info("(Migration)", "Migration complete");
        });
}
