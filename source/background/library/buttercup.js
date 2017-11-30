import {
    ArchiveManager,
    createCredentials,
    WebDAVDatasource,
    Web as ButtercupWeb
} from "buttercup/dist/buttercup-web.min.js";
import ChannelQueue, { TASK_TYPE_HIGH_PRIORITY } from "@buttercup/channel-queue";
import log from "../../shared/library/log.js";
import { dispatch } from "../redux/index.js";
import { addArchive } from "../../shared/actions/archives.js";

const { LocalStorageInterface } = ButtercupWeb;

let __archiveManager, __queue;

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
}

function createArchiveManager() {
    const queue = getQueue();
    return queue.channel("archiveManager").enqueue(() => {
        const am = new ArchiveManager(new LocalStorageInterface());
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

createArchiveManager();
