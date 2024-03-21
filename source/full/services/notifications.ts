import { Layerr } from "layerr";
import { sendBackgroundMessage } from "../../shared/services/messaging.js";
import { BackgroundMessageType } from "../types.js";

export async function updateReadNotifications(notificationName: string): Promise<void> {
    const resp = await sendBackgroundMessage({
        notification: notificationName,
        type: BackgroundMessageType.MarkNotificationRead
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed updating read notifications");
    }
}
