import { Layerr } from "layerr";
import { getExtensionAPI } from "../../shared/extension.js";
import {
    authenticateBrowserAccess,
    getOTPs,
    getVaultSources,
    getVaultsTree,
    hasConnection,
    initiateConnection,
    promptSourceLock,
    promptSourceUnlock,
    searchEntriesByTerm,
    searchEntriesByURL,
    testAuth
} from "./desktop/actions.js";
import { clearLocalStorage, removeLocalValue, setLocalValue } from "./storage.js";
import { errorToString } from "../../shared/library/error.js";
import { getAllCredentials, getCredentialsForID, updateUsedCredentials } from "./loginMemory.js";
import { getConfig, updateConfigValue } from "./config.js";
import { getDisabledDomains } from "./disabledDomains.js";
import { log } from "./log.js";
import { BackgroundMessage, BackgroundMessageType, BackgroundResponse, LocalStorageItem } from "../types.js";

async function handleMessage(
    msg: BackgroundMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (resp: BackgroundResponse) => void
) {
    switch (msg.type) {
        case BackgroundMessageType.AuthenticateDesktopConnection: {
            log("complete desktop authentication");
            const publicKey = await authenticateBrowserAccess(msg.code);
            await setLocalValue(LocalStorageItem.APIServerPublicKey, publicKey);
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
            log("clear desktop authentication");
            await removeLocalValue(LocalStorageItem.APIClientID);
            await removeLocalValue(LocalStorageItem.APIServerPublicKey);
            sendResponse({});
            break;
        }
        case BackgroundMessageType.GetConfiguration: {
            const config = getConfig();
            sendResponse({
                config
            });
            break;
        }
        case BackgroundMessageType.GetDesktopVaultSources: {
            const sources = await getVaultSources();
            sendResponse({
                vaultSources: sources
            });
            break;
        }
        case BackgroundMessageType.GetDesktopVaultsTree: {
            const tree = await getVaultsTree();
            sendResponse({
                vaultsTree: tree
            });
            break;
        }
        case BackgroundMessageType.GetDisabledDomains: {
            const domains = await getDisabledDomains();
            sendResponse({
                domains
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
        case BackgroundMessageType.GetSavedCredentials: {
            const credentials = getAllCredentials();
            sendResponse({
                credentials
            });
            break;
        }
        case BackgroundMessageType.GetSavedCredentialsForID: {
            const credentials = getCredentialsForID(msg.credentialsID);
            sendResponse({
                credentials: [credentials]
            });
            break;
        }
        case BackgroundMessageType.InitiateDesktopConnection: {
            log("start desktop authentication");
            await initiateConnection();
            sendResponse({});
            break;
        }
        case BackgroundMessageType.PromptLockSource: {
            const { sourceID } = msg;
            log(`request lock source: ${sourceID}`);
            const locked = await promptSourceLock(sourceID);
            sendResponse({
                locked
            });
            break;
        }
        case BackgroundMessageType.PromptUnlockSource: {
            const { sourceID } = msg;
            log(`request unlock source: ${sourceID}`);
            await promptSourceUnlock(sourceID);
            sendResponse({});
            break;
        }
        case BackgroundMessageType.ResetSettings: {
            log(`reset settings`);
            await clearLocalStorage();
            sendResponse({});
            break;
        }
        case BackgroundMessageType.SaveUsedCredentials: {
            const { credentials } = msg;
            updateUsedCredentials(credentials, sender.tab.id);
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
        case BackgroundMessageType.SetConfigurationValue: {
            await updateConfigValue(msg.configKey, msg.configValue);
            sendResponse({});
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
