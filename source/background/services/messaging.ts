import { Layerr } from "layerr";
import { getExtensionAPI } from "../../shared/extension.js";
import {
    authenticateBrowserAccess,
    getOTPs,
    getVaultSources,
    hasConnection,
    initiateConnection,
    searchEntriesByTerm,
    searchEntriesByURL,
    testAuth
} from "./desktop/connection.js";
import { removeLocalValue, setLocalValue } from "./storage.js";
import { errorToString } from "../../shared/library/error.js";
import { BackgroundMessage, BackgroundMessageType, BackgroundResponse, LocalStorageItem } from "../types.js";

async function handleMessage(
    msg: BackgroundMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (resp: BackgroundResponse) => void
) {
    switch (msg.type) {
        case BackgroundMessageType.AuthenticateDesktopConnection: {
            const token = await authenticateBrowserAccess(msg.code);
            await setLocalValue(LocalStorageItem.DesktopToken, token);
            sendResponse({});
            break;
        }
        case BackgroundMessageType.CheckDesktopConnection: {
            const available = await hasConnection();
            if (available) {
                await testAuth();
            }
            sendResponse({
                available
            });
            break;
        }
        case BackgroundMessageType.ClearDesktopAuthentication: {
            await removeLocalValue(LocalStorageItem.DesktopToken);
            sendResponse({});
            break;
        }
        case BackgroundMessageType.GetDesktopVaultSources: {
            const sources = await getVaultSources();
            sendResponse({
                vaultSources: sources
            });
            break;
        }
        case BackgroundMessageType.GetOTPs: {
            const otps = await getOTPs();
            sendResponse({
                otps
            });
            break;
        }
        case BackgroundMessageType.InitiateDesktopConnection: {
            await initiateConnection();
            sendResponse({});
            break;
        }
        case BackgroundMessageType.SearchEntriesByTerm: {
            const searchResults = await searchEntriesByTerm(msg.searchTerm);
            sendResponse({
                searchResults
            });
            break;
        }
        case BackgroundMessageType.SearchEntriesByURL: {
            const searchResults = await searchEntriesByURL(msg.url);
            sendResponse({
                searchResults
            });
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
                error: errorToString(new Layerr(err, "Background task failed"))
            });
        });
        return true;
    });
}
