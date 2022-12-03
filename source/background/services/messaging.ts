import { Layerr } from "layerr";
import { getExtensionAPI } from "../../shared/extension.js";
import { routeProviderAuthentication } from "../library/datasource.js";
import { BackgroundMessage, BackgroundMessageType, BackgroundResponse } from "../types.js";

async function handleMessage(
    msg: BackgroundMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (resp: BackgroundResponse) => void
) {
    switch (msg.type) {
        case BackgroundMessageType.AuthenticateProvider: {
            const result = await routeProviderAuthentication(msg.datasource);
            sendResponse(result);
            return;
        }
        default:
            throw new Error(`Unsupported message type: ${msg.type}`);
    }
}

export function initialise() {
    getExtensionAPI().runtime.onMessage.addListener((request, sender, sendResponse) => {
        handleMessage(request, sender, sendResponse).catch((err) => {
            sendResponse({
                error: new Layerr(err, "Background task failed")
            });
        });
        return true;
    });
}
