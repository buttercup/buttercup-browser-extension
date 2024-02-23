import { Layerr } from "layerr";
import { EntryType, EntryURLType, VaultSourceID, VaultSourceStatus, getEntryURLs } from "buttercup";
import { getExtensionAPI } from "../../shared/extension.js";
import {
    authenticateBrowserAccess,
    getEntrySearchResults,
    getOTPs,
    getVaultSources,
    getVaultsTree,
    hasConnection,
    initiateConnection,
    promptSourceLock,
    promptSourceUnlock,
    saveExistingEntry,
    saveNewEntry,
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
import { resetInitialisation } from "./init.js";
import { getRecents, trackRecentUsage } from "./recents.js";
import { openEntryPageInNewTab } from "./entry.js";
import { getAutoLoginForTab, registerAutoLogin } from "./autoLogin.js";
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
        case BackgroundMessageType.GetAutoLoginForTab: {
            const tabID = sender.tab?.id;
            if (!tabID) {
                sendResponse({ autoLogin: null });
                break;
            }
            const entry = getAutoLoginForTab(tabID);
            sendResponse({ autoLogin: entry });
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
        case BackgroundMessageType.GetRecentEntries: {
            const { count = 10 } = msg;
            const sources = await getVaultSources();
            const unlockedIDs: Array<VaultSourceID> = sources.reduce((output, source) => {
                if (source.state === VaultSourceStatus.Unlocked) {
                    return [...output, source.id];
                }
                return output;
            }, []);
            const recentItems = await getRecents(unlockedIDs);
            recentItems.splice(count, Infinity);
            const searchResults = await getEntrySearchResults(
                recentItems.map((item) => ({
                    entryID: item.entryID,
                    sourceID: item.sourceID
                }))
            );
            sendResponse({
                searchResults
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
        case BackgroundMessageType.OpenEntryPage: {
            const { autoLogin, entry } = msg;
            const [url = null] = getEntryURLs(entry.properties, EntryURLType.Login);
            if (!url) {
                sendResponse({ opened: false });
                return;
            }
            log(`open entry page by url: ${entry.id} (${url})`);
            const tabID = await openEntryPageInNewTab(entry, url);
            if (autoLogin) {
                registerAutoLogin(entry, tabID);
            }
            sendResponse({ opened: true });
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
            await resetInitialisation();
            sendResponse({});
            break;
        }
        case BackgroundMessageType.SaveCredentialsToVault: {
            const { sourceID, groupID, entryID = null, entryProperties, entryType = EntryType.Website } = msg;
            if (entryID) {
                log(`save credentials to existing entry: ${entryID} (source=${sourceID})`);
                await saveExistingEntry(sourceID, groupID, entryID, entryProperties);
                sendResponse({
                    entryID: null
                });
            } else {
                log(`save credentials to new entry (source=${sourceID})`);
                const entryID = await saveNewEntry(sourceID, groupID, entryType, entryProperties);
                sendResponse({
                    entryID
                });
            }
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
        case BackgroundMessageType.TrackRecentEntry: {
            const { entry } = msg;
            if (!entry.sourceID) {
                throw new Error(`No source ID in entry result: ${entry.id}`);
            }
            await trackRecentUsage(entry.sourceID, entry.id);
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
