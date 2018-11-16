import ChannelQueue, { TASK_TYPE_HIGH_PRIORITY } from "@buttercup/channel-queue";
import ms from "ms";
import { ArchiveManager, vendor as ButtercupVendor } from "../../shared/library/buttercup.js";
import log from "../../shared/library/log.js";
import { dispatch } from "../redux/index.js";
import { setArchives } from "../../shared/actions/archives.js";
import BrowserStorageInterface from "./BrowserStorageInterface.js";
import { migrateLocalStorageToChromeStorage } from "./storageMigration.js";

let __archiveManager, __queue;

function attachArchiveManagerListeners(archiveManager) {
    archiveManager.on("sourcesUpdated", sources => {
        dispatch(
            setArchives(
                sources.map(source => ({
                    ...source,
                    // Compatibility:
                    title: source.name,
                    state: source.status
                }))
            )
        );
    });
}

function createArchiveManager() {
    const queue = getQueue();
    return queue.channel("archiveManager").enqueue(() => {
        const am = new ArchiveManager(new BrowserStorageInterface());
        attachArchiveManagerListeners(am);
        return am.rehydrate().then(() => {
            log.info("Rehydrated archive manager");
            __archiveManager = am;
            am.toggleAutoUpdating(true, ms("2m"));
            am.on("autoUpdateStop", () => {
                log.info("Completed auto-update");
            });
            log.info("Activated auto updating");
        });
    }, TASK_TYPE_HIGH_PRIORITY);
}

export function getArchiveManager() {
    return getQueue()
        .channel("archiveManager")
        .enqueue(() => __archiveManager);
}

export function getQueue() {
    if (!__queue) {
        __queue = new ChannelQueue();
    }
    return __queue;
}

migrateLocalStorageToChromeStorage(getQueue()).then(() => createArchiveManager());
