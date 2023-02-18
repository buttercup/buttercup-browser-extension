import { Layerr } from "layerr";
import { getExtensionAPI } from "../../shared/extension.js";
import { routeProviderAuthentication } from "../library/datasource.js";
import { waitForInitialisation } from "./init.js";
import { connectVault } from "./vaultConnection.js";
import { BackgroundMessage, BackgroundMessageType, BackgroundResponse } from "../types.js";
import { removeSource, unlockSource } from "./buttercup.js";

async function handleMessage(
    msg: BackgroundMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (resp: BackgroundResponse) => void
) {
    // Wait for SW startup
    await waitForInitialisation();
    switch (msg.type) {
        case BackgroundMessageType.AddVault: {
            const sourceID = await connectVault(msg.payload);
            sendResponse({ sourceID });
            break;
        }
        case BackgroundMessageType.AuthenticateProvider: {
            const result = await routeProviderAuthentication(msg.datasource);
            sendResponse(result);
            break;
        }
        case BackgroundMessageType.KeepAlive:
            sendResponse({});
            break;
        case BackgroundMessageType.RemoveSource:
            await removeSource(msg.sourceID);
            sendResponse({});
            break;
        case BackgroundMessageType.UnlockSource:
            await unlockSource(msg.sourceID, msg.password);
            sendResponse({});
            break;
        default:
            // Do nothing
            break;
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
