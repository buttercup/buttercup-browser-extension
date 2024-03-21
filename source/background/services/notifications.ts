import { getSyncValue, setSyncValue } from "./storage.js";
import { SyncStorageItem } from "../types.js";
import { NOTIFICATION_NAMES } from "../../shared/notifications/index.js";
import { createNewTab, getExtensionURL } from "../../shared/library/extension.js";

async function getPendingNotifications(): Promise<Array<string>> {
    const existingNotificationsRaw = await getSyncValue(SyncStorageItem.Notifications);
    const existingNotifications = existingNotificationsRaw ? existingNotificationsRaw.split(",") : [];
    return NOTIFICATION_NAMES.filter((name) => !existingNotifications.includes(name));
}

export async function markNotificationRead(name: string): Promise<void> {
    const existingNotificationsRaw = await getSyncValue(SyncStorageItem.Notifications);
    const notifications = existingNotificationsRaw ? existingNotificationsRaw.split(",") : [];
    if (!notifications.includes(name)) {
        notifications.push(name);
    }
    await setSyncValue(SyncStorageItem.Notifications, notifications.join(","));
}

export async function showPendingNotifications(): Promise<void> {
    const notifications = await getPendingNotifications();
    if (notifications.length <= 0) return;
    await createNewTab(getExtensionURL(`full.html#/notifications?notifications=${notifications.join(",")}`));
}
