import ChannelQueue from "@buttercup/channel-queue";
import { createVaultFacade } from "../../shared/library/buttercup.js";
import { getVaultManager } from "./buttercup.js";
import { getArchive } from "./archives.js";

let __facades = [],
    __queue = null;

export function getFacades() {
    return __facades;
}

export function updateFacades() {
    if (!__queue) {
        __queue = new ChannelQueue();
    }
    return __queue.channel("generation").enqueue(
        () =>
            getVaultManager().then(vaultManager =>
                Promise.all(
                    vaultManager.unlockedSources.map(source =>
                        getArchive(source.id).then(archive => ({
                            ...createVaultFacade(archive),
                            sourceID: source.id,
                            sourceName: source.name
                        }))
                    )
                ).then(results => {
                    __facades = results;
                })
            ),
        undefined,
        "regen"
    );
}
