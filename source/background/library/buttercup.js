import {
    ArchiveManager,
    createCredentials,
    WebDAVDatasource,
    vendor as ButtercupVendor
} from "../../shared/library/buttercup.js";
import ChannelQueue, { TASK_TYPE_HIGH_PRIORITY } from "@buttercup/channel-queue";
import log from "../../shared/library/log.js";
import { dispatch } from "../redux/index.js";
import { addArchive, removeArchive, setArchiveLocked, setArchiveUnlocked } from "../../shared/actions/archives.js";
import BrowserStorageInterface from "./BrowserStorageInterface.js";
import { migrateLocalStorageToChromeStorage } from "./storageMigration.js";

let __archiveManager, __queue;

ButtercupVendor.webdavFS.setFetchMethod(window.fetch);

function attachArchiveManagerListeners(archiveManager) {
    archiveManager.on("sourceRehydrated", sourceInfo => {
        log.info(`Rehydrated source: '${sourceInfo.name}' (${sourceInfo.id})`);
        dispatch(
            addArchive({
                id: sourceInfo.id,
                title: sourceInfo.name,
                type: sourceInfo.type,
                state: sourceInfo.status
            })
        );
    });
    archiveManager.on("sourceAdded", sourceInfo => {
        log.info(`Added source: '${sourceInfo.name}' (${sourceInfo.id})`);
        dispatch(
            addArchive({
                id: sourceInfo.id,
                title: sourceInfo.name,
                type: sourceInfo.type,
                state: sourceInfo.status
            })
        );
    });
    archiveManager.on("sourceRemoved", sourceInfo => {
        const { id } = sourceInfo;
        dispatch(removeArchive(id));
    });
    archiveManager.on("sourceUnlocked", sourceInfo => {
        const { id } = sourceInfo;
        dispatch(setArchiveUnlocked(id));
    });
    archiveManager.on("sourceLocked", sourceInfo => {
        const { id } = sourceInfo;
        dispatch(setArchiveLocked(id));
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
