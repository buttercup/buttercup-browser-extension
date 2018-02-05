import { TASK_TYPE_HIGH_PRIORITY } from "@buttercup/channel-queue";
import log from "../../shared/library/log.js";
import { getDefaultStorageAdapter } from "./BrowserStorageInterface.js";

export function migrateLocalStorageToChromeStorage(queue) {
    log.info("(Migration)", "Beginning data migration for new storage");
    return queue
        .channel("archiveManager")
        .enqueue(() => {
            const browserStorage = getDefaultStorageAdapter();
            const keys = Object.keys(window.localStorage).filter(key => /^bcup_archivemgr/.test(key));
            const payload = keys.reduce(
                (current, key) => ({
                    ...current,
                    [key]: window.localStorage[key]
                }),
                {}
            );
            log.info("(Migration)", `Migrating ${keys.length} keys`);
            return new Promise(resolve => {
                browserStorage.set(payload, () => resolve(keys));
            });
        }, TASK_TYPE_HIGH_PRIORITY)
        .then(keys => {
            log.info("(Migration)", "Removing original items");
            keys.forEach(key => {
                window.localStorage.removeItem(key);
            });
            log.info("(Migration)", "Migration complete");
        });
}
