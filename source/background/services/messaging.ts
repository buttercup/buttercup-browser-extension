import { Layerr } from "layerr";
import { getExtensionAPI } from "../../shared/extension.js";
import { hasConnection } from "./desktop/connection.js";
import { BackgroundMessage, BackgroundMessageType, BackgroundResponse } from "../types.js";

async function handleMessage<T extends BackgroundMessageType>(
    msg: BackgroundMessage[T],
    sender: chrome.runtime.MessageSender,
    sendResponse: (resp: BackgroundResponse[T]) => void
) {
    switch (msg.type) {
        case BackgroundMessageType.CheckDesktopConnection: {
            const available = await hasConnection();
            sendResponse({
                available
            });
            break;
        }
        case BackgroundMessageType.InitiateDesktopConnection: {
            break;
        }
        default:
            throw new Layerr(`Unrecognised message type: ${(msg as any).type}`);
    }
}

export function initialise() {
    getExtensionAPI().runtime.onMessage.addListener((request, sender, sendResponse) => {
        handleMessage(request, sender, sendResponse).catch((err) => {
            console.error(err);
            sendResponse({
                error: new Layerr(err, "Background task failed")
            });
        });
        return true;
    });
}
