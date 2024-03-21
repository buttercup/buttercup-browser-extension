import { EntryID, VaultSourceID } from "buttercup";
import { ChannelQueue, TaskPriority } from "@buttercup/channel-queue";
import ms from "ms";
import { getSyncValue, setSyncValue } from "./storage.js";
import { SyncStorageItem } from "../types.js";

export interface RecentItem {
    entryID: EntryID;
    sourceID: VaultSourceID;
    uses: Array<number>;
}

const MAX_USE_AGE = ms("30d");

let __queue: ChannelQueue | null = null;

function getQueue(): ChannelQueue {
    if (!__queue) {
        __queue = new ChannelQueue();
    }
    return __queue;
}

export async function getRecents(sourceIDs: Array<VaultSourceID>): Promise<Array<RecentItem>> {
    const currentRecentsRaw = await getSyncValue(SyncStorageItem.RecentItems);
    if (!currentRecentsRaw) return [];
    const currentRecents = JSON.parse(currentRecentsRaw) as Array<RecentItem>;
    return currentRecents.filter((recent) => sourceIDs.includes(recent.sourceID));
}

function sortUses(itemA: RecentItem, itemB: RecentItem): number {
    if (itemA.uses.length > itemB.uses.length) return -1;
    if (itemB.uses.length > itemA.uses.length) return 1;
    return 0;
}

function stripOldUses(items: Array<RecentItem>): Array<RecentItem> {
    const earliestTs = Date.now() - MAX_USE_AGE;
    return items.reduce((output: Array<RecentItem>, item: RecentItem) => {
        const hasRecentUse = item.uses.some((ts) => ts >= earliestTs);
        if (!hasRecentUse) return output;
        return [
            ...output,
            {
                ...item,
                uses: item.uses.filter((ts) => ts >= earliestTs)
            }
        ];
    }, []);
}

export async function trackRecentUsage(sourceID: VaultSourceID, entryID: EntryID): Promise<void> {
    const channel = getQueue().channel("write");
    await channel.enqueue(
        async () => {
            const currentRecentsRaw = await getSyncValue(SyncStorageItem.RecentItems);
            let currentRecents = currentRecentsRaw ? (JSON.parse(currentRecentsRaw) as Array<RecentItem>) : [];
            let existingResult = currentRecents.find(
                (recent) => recent.sourceID === sourceID && recent.entryID === entryID
            );
            if (existingResult) {
                existingResult.uses.unshift(Date.now());
            } else {
                existingResult = {
                    entryID,
                    sourceID,
                    uses: [Date.now()]
                };
                currentRecents.push(existingResult);
            }
            currentRecents = stripOldUses(currentRecents);
            currentRecents.sort(sortUses);
            await setSyncValue(SyncStorageItem.RecentItems, JSON.stringify(currentRecents));
        },
        TaskPriority.Normal,
        `${sourceID}-${entryID}`
    );
}
