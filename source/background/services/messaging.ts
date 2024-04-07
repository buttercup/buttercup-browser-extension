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
import {
    clearCredentials,
    credentialsAlreadyStored,
    getAllCredentials,
    getCredentialsForID,
    getLastCredentials,
    stopPromptForID,
    updateUsedCredentials
} from "./loginMemory.js";
import { getConfig, updateConfigValue } from "./config.js";
import { disableLoginsOnDomain, getDisabledDomains, removeDisabledFlagForDomain } from "./disabledDomains.js";
import { log } from "./log.js";
import { resetInitialisation } from "./init.js";
import { getRecents, trackRecentUsage } from "./recents.js";
import { openEntryPageInNewTab } from "./entry.js";
import { getAutoLoginForTab, registerAutoLogin } from "./autoLogin.js";
import { extractDomainFromCredentials } from "../library/domain.js";
import {
    BackgroundMessage,
    BackgroundMessageType,
    BackgroundResponse,
    LocalStorageItem,
    TabEventType
} from "../types.js";
import { markNotificationRead } from "./notifications.js";
import { createNewTab, getExtensionURL } from "../../shared/library/extension.js";
import { sendTabsMessage } from "./tabs.js";

async function handleMessage(
    msg: BackgroundMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (resp: BackgroundResponse) => void
) {
    switch (msg.type) {
        case BackgroundMessageType.AuthenticateDesktopConnection: {
            const { code } = msg;
            if (!code) {
                throw new Error("No auth code provided");
            }
            log("complete desktop authentication");
            const publicKey = await authenticateBrowserAccess(code);
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
        case BackgroundMessageType.ClearSavedCredentials: {
            const { credentialsID } = msg;
            if (!credentialsID) {
                throw new Error("No credentials ID provided");
            }
            log(`clear saved credentials: ${credentialsID}`);
            clearCredentials(credentialsID);
            sendResponse({});
            break;
        }
        case BackgroundMessageType.ClearSavedCredentialsPrompt: {
            const { credentialsID } = msg;
            if (!credentialsID) {
                throw new Error("No credentials ID provided");
            }
            log(`clear saved credentials prompt: ${credentialsID}`);
            stopPromptForID(credentialsID);
            await sendTabsMessage({
                type: TabEventType.CloseSaveDialog
            });
            sendResponse({});
            break;
        }
        case BackgroundMessageType.DeleteDisabledDomains: {
            const { domains } = msg;
            if (!domains) {
                throw new Error("No domains list provided");
            }
            log(`remove disabled domains: ${domains.join(", ")}`);
            for (const domain of domains) {
                await removeDisabledFlagForDomain(domain);
            }
            sendResponse({});
            break;
        }
        case BackgroundMessageType.DisableSavePromptForCredentials: {
            const { credentialsID } = msg;
            if (!credentialsID) {
                throw new Error("No credentials ID provided");
            }
            log(`disable save prompt for credentials: ${credentialsID}`);
            try {
                const credentials = getCredentialsForID(credentialsID);
                const domain = credentials ? extractDomainFromCredentials(credentials) : null;
                if (domain) {
                    log(`disable save prompt for domain: ${domain}`);
                    await disableLoginsOnDomain(domain);
                }
            } catch (err) {
                throw new Layerr(err, "Failed disabling save prompt for domain");
            }
            await sendTabsMessage({
                type: TabEventType.CloseSaveDialog
            });
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
        case BackgroundMessageType.GetLastSavedCredentials: {
            const { excludeSaved = false } = msg;
            const tabID = sender.tab?.id;
            if (!tabID) {
                sendResponse({ credentials: [null] });
                break;
            }
            let credentials = getLastCredentials(tabID);
            if (credentials && excludeSaved && (await credentialsAlreadyStored(credentials))) {
                credentials = null;
            }
            sendResponse({
                credentials: [credentials]
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
            const { credentialsID, excludeSaved = false } = msg;
            if (!credentialsID) {
                throw new Error("No credentials ID provided");
            }
            let credentials = getCredentialsForID(credentialsID);
            if (credentials && excludeSaved && (await credentialsAlreadyStored(credentials))) {
                credentials = null;
            }
            sendResponse({
                credentials: [credentials]
            });
            break;
        }
        case BackgroundMessageType.InitiateDesktopConnection: {
            log("start desktop authentication");
            await initiateConnection();
            await createNewTab(getExtensionURL("full.html#/connect"));
            sendResponse({});
            break;
        }
        case BackgroundMessageType.MarkNotificationRead: {
            const { notification } = msg;
            if (!notification) {
                throw new Error("No notification provided");
            }
            log(`mark notification read: ${notification}`);
            await markNotificationRead(notification);
            sendResponse({});
            break;
        }
        case BackgroundMessageType.OpenEntryPage: {
            const { autoLogin, entry } = msg;
            if (!entry) {
                throw new Error("No entry provided");
            }
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
        case BackgroundMessageType.OpenSaveCredentialsPage: {
            await createNewTab(getExtensionURL("full.html#/save-credentials"));
            await sendTabsMessage({
                type: TabEventType.CloseSaveDialog
            });
            sendResponse({});
            break;
        }
        case BackgroundMessageType.PromptLockSource: {
            const { sourceID } = msg;
            if (!sourceID) {
                throw new Error("No source ID provided");
            }
            log(`request lock source: ${sourceID}`);
            const locked = await promptSourceLock(sourceID);
            sendResponse({
                locked
            });
            break;
        }
        case BackgroundMessageType.PromptUnlockSource: {
            const { sourceID } = msg;
            if (!sourceID) {
                throw new Error("No source ID provided");
            }
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
            if (!sourceID) {
                throw new Error("No source ID provided");
            }
            if (!groupID) {
                throw new Error("No group ID provided");
            }
            if (!entryProperties) {
                throw new Error("No entry properties provided");
            }
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
            if (!credentials) {
                throw new Error("No source ID provided");
            }
            if (!sender.tab?.id) {
                throw new Error("No tab ID available for background message");
            }
            updateUsedCredentials(credentials, sender.tab.id);
            sendResponse({});
            break;
        }
        case BackgroundMessageType.SearchEntriesByTerm: {
            const { searchTerm } = msg;
            if (!searchTerm) {
                throw new Error("No search term provided");
            }
            const searchResults = await searchEntriesByTerm(searchTerm);
            sendResponse({
                searchResults
            });
            break;
        }
        case BackgroundMessageType.SearchEntriesByURL: {
            const { url } = msg;
            if (!url) {
                throw new Error("No URL provided");
            }
            const searchResults = await searchEntriesByURL(url);
            sendResponse({
                searchResults
            });
            break;
        }
        case BackgroundMessageType.SetConfigurationValue: {
            const { configKey, configValue } = msg;
            if (!configKey || typeof configValue === "undefined") {
                throw new Error("Invalid configuration proivided provided");
            }
            await updateConfigValue(configKey, configValue);
            sendResponse({});
            break;
        }
        case BackgroundMessageType.TrackRecentEntry: {
            const { entry } = msg;
            if (!entry) {
                throw new Error("No entry provided");
            }
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
