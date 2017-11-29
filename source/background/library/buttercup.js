import {
    ArchiveManager,
    createCredentials,
    WebDAVDatasource,
    Web as ButtercupWeb
} from "buttercup/dist/buttercup-web.min.js";
import ChannelQueue, { TASK_TYPE_HIGH_PRIORITY } from "@buttercup/channel-queue";
import log from "../../shared/library/log.js";

const { LocalStorageInterface } = ButtercupWeb;

let __archiveManager, __queue;

function createArchiveManager() {
    const queue = getQueue();
    return queue.channel("archiveManager").enqueue(() => {
        const am = new ArchiveManager(new LocalStorageInterface());
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

createArchiveManager();
