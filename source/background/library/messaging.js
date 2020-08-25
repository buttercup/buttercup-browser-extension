import { extractDomain } from "../../shared/library/domain.js";
import {
    consumeVaultFacade,
    createEntryFacade,
    createVaultFacade
} from "../../shared/library/buttercup.js";
import { dispatch, getState } from "../redux/index.js";
import log from "../../shared/library/log.js";
import {
    addArchiveByRequest,
    addNewEntry,
    archiveToObjectGroupsOnly,
    changeVaultPassword,
    generateEntryPath,
    getArchive,
    getEntry,
    getNameForSource,
    getSourceIDForVaultID,
    getSourcesInfo,
    getUnlockedSourcesCount,
    lockSource,
    lockSources,
    openCredentialsPageForEntry,
    removeSource,
    saveSource,
    sendCredentialsToTab,
    unlockSource,
} from "./archives.js";
import { setEntrySearchResults, setSourcesCount } from "../../shared/actions/searching.js";
import { setConfigValue, setUserActivity } from "../../shared/actions/app.js";
import { setAutoLogin } from "../../shared/actions/autoLogin.js";
import { lastPassword } from "./lastGeneratedPassword.js";
import { createNewTab, getCurrentTab, sendTabMessage } from "../../shared/library/extension.js";
import { getConfig } from "../../shared/selectors/app.js";
import { authenticateWithoutToken as authenticateGoogleDrive } from "./googleDrive.js";
import { disableLoginsOnDomain, getDisabledDomains, removeDisabledFlagForDomain } from "./disabledLogin.js";
import { getLogins, removeLogin, stopPromptForTab, updateLogin } from "./loginMemory.js";
import { getSearch } from "./search.js";
import { addAttachments, deleteAttachment, getAttachment, getAttachmentDetails } from "./attachments.js";

export function clearSearchResults() {
    return getUnlockedSourcesCount().then(unlockedSources => {
        dispatch(setEntrySearchResults([]));
        dispatch(setSourcesCount(unlockedSources));
    });
}

function handleMessage(request, sender, sendResponse) {
    switch (request.type) {
        case "add-archive": {
            const { payload } = request;
            addArchiveByRequest(payload)
                .then(() => {
                    sendResponse({ ok: true });
                })
                .catch(err => {
                    sendResponse({ ok: false, error: err.message });
                    console.error(err);
                });
            // Async
            return true;
        }
        case "add-attachments": {
            const { sourceID, entryID, files } = request;
            log.info(`Adding ${files.length} attachments to source: ${sourceID}`);
            addAttachments(sourceID, entryID, files)
                .then(() => {
                    sendResponse({ ok: true });
                })
                .catch(err => {
                    sendResponse({ ok: false, error: err.message });
                    console.error(err);
                });
            return true;
        }
        case "add-new-entry": {
            const { payload } = request;
            const { username, password, url, title, sourceID, groupID } = payload;
            addNewEntry(sourceID, groupID, title, username, password, url)
                .then(() => {
                    sendResponse({ ok: true });
                })
                .catch(err => {
                    sendResponse({ ok: false, error: err.message });
                    console.error(err);
                });
            return true;
        }
        case "apply-vault-facade": {
            const { sourceID, facade } = request;
            log.info(`Apply vault facade update for source: ${sourceID}`);
            getArchive(sourceID)
                .then(archive => {
                    consumeVaultFacade(archive, facade);
                    return saveSource(sourceID);
                })
                .then(() => {
                    sendResponse({ ok: true });
                })
                .catch(err => {
                    sendResponse({ ok: false, error: err.message });
                    console.error(err);
                });
            return true;
        }
        case "authenticate-google-drive": {
            const { useOpenPermissions = false } = request;
            authenticateGoogleDrive(undefined, useOpenPermissions);
            return false;
        }
        case "change-vault-password": {
            const { sourceID, oldPassword, newPassword, meta = {} } = request;
            changeVaultPassword(sourceID, oldPassword, newPassword, meta)
                .then(() => {
                    sendResponse({ ok: true });
                })
                .catch(err => {
                    sendResponse({ ok: false, error: err.message });
                    console.error(err);
                });
            return true;
        }
        case "clear-search":
            clearSearchResults();
            return false;
        case "create-vault-facade": {
            const { sourceID } = request;
            getArchive(sourceID)
                .then(archive => {
                    const facade = createVaultFacade(archive);
                    sendResponse({ ok: true, facade });
                })
                .catch(err => {
                    sendResponse({ ok: false, error: err.message });
                    console.error(err);
                });
            return true;
        }
        case "delete-attachment": {
            const { sourceID, entryID, attachmentID } = request;
            log.info(`Deleting attachment: ${attachmentID} (from source/entry: ${sourceID}/${entryID})`);
            deleteAttachment(sourceID, entryID, attachmentID)
                .then(() => {
                    sendResponse({ ok: true });
                })
                .catch(err => {
                    sendResponse({ ok: false, error: err.message });
                    console.error(err);
                });
            return true;
        }
        case "disable-login-domain": {
            const [lastLogin] = getLogins();
            let domain = request.domain;
            if (!domain) {
                if (lastLogin) {
                    domain = extractDomain(lastLogin.url);
                } else if (sender.tab.url) {
                    domain = extractDomain(sender.tab.url);
                } else {
                    log.error("No domain or last-login available to disable");
                    sendResponse({ ok: false, error: "No domain found" });
                    return true;
                }
            }
            log.info(`Disabling save-login prompt for domain: ${domain}`);
            disableLoginsOnDomain(domain)
                .then(() => {
                    sendResponse({ ok: true });
                })
                .catch(err => {
                    sendResponse({ ok: false, error: err.message });
                    console.error(err);
                });
            return true;
        }
        case "get-attachment": {
            const { sourceID, entryID, attachmentID } = request;
            log.info(`Fetching attachment: ${attachmentID} (from source/entry: ${sourceID}/${entryID})`);
            getAttachment(sourceID, entryID, attachmentID)
                .then(data => {
                    sendResponse({ ok: true, data });
                })
                .catch(err => {
                    sendResponse({ ok: false, error: err.message });
                    console.error(err);
                });
            return true;
        }
        case "get-attachment-details": {
            const { sourceID, entryID, attachmentID } = request;
            log.info(`Retrieving attachment details: ${attachmentID} (from source/entry: ${sourceID}/${entryID})`);
            getAttachmentDetails(sourceID, entryID, attachmentID)
                .then(details => {
                    sendResponse({ ok: true, details });
                })
                .catch(err => {
                    sendResponse({ ok: false, error: err.message });
                    console.error(err);
                });
            return true;
        }
        case "get-config":
            sendResponse({ config: getConfig(getState()) });
            return false;
        case "get-disabled-save-prompt-domains": {
            getDisabledDomains().then(domains => {
                sendResponse({ domains });
            });
            return true;
        }
        case "get-groups-tree": {
            const { sourceID } = request;
            getArchive(sourceID)
                .then(archive => {
                    const obj = archiveToObjectGroupsOnly(archive);
                    sendResponse({ ok: true, groups: obj.groups });
                })
                .catch(err => {
                    sendResponse({ ok: false, error: err.message });
                    console.error(err);
                });
            return true;
        }
        case "get-sources-stats":
            getUnlockedSourcesCount()
                .then(unlockedSources => {
                    sendResponse({
                        ok: true,
                        unlocked: unlockedSources,
                    });
                })
                .catch(err => {
                    sendResponse({ ok: false, error: err.message });
                    console.error(err);
                });
            return true;
        case "get-used-credentials": {
            const { mode = "tab" } = request;
            sendResponse({
                ok: true,
                credentials: getLogins(mode === "tab" ? sender.tab.id : null),
            });
            return false;
        }
        case "get-vaultsinfo": {
            getSourcesInfo()
                .then(items => {
                    sendResponse({ ok: true, items });
                })
                .catch(err => {
                    sendResponse({ ok: false, error: err.message });
                    console.error(err);
                });
            return true;
        }
        case "lock-all-archives": {
            clearSearchResults();
            lockSources()
                .then(() => {
                    sendResponse({ ok: true });
                })
                .catch(err => {
                    sendResponse({ ok: false, error: err.message });
                    console.error(err);
                });
            return true;
        }
        case "lock-archive": {
            const { sourceID } = request;
            lockSource(sourceID)
                .then(() => {
                    sendResponse({ ok: true });
                })
                .catch(err => {
                    sendResponse({ ok: false, error: err.message });
                    console.error(err);
                });
            return true;
        }
        case "open-credentials-url": {
            const { sourceID, entryID, autoLogin = false } = request;
            log.info(`Received request to open URL for entry: ${entryID} (auto-login: ${autoLogin.toString()})`);
            openCredentialsPageForEntry(sourceID, entryID).then(tab => {
                if (autoLogin) {
                    dispatch(
                        setAutoLogin({
                            sourceID,
                            entryID,
                            tabID: tab.id,
                        })
                    );
                }
            });
            return false;
        }
        case "open-tab": {
            const { url } = request;
            log.info(`Will open new tab by request: ${url}`);
            createNewTab(url);
            return false;
        }
        case "remove-archive": {
            const { sourceID } = request;
            log.info(`Received request to remove source: ${sourceID}`);
            removeSource(sourceID)
                .then(() => {
                    sendResponse({ ok: true });
                })
                .catch(err => {
                    sendResponse({ ok: false, error: err.message });
                    console.error(err);
                });
            return true;
        }
        case "remove-disabled-login-domain": {
            const { domain } = request;
            log.info(`Removing disabled-flag for save-login prompt for domain: ${domain}`);
            removeDisabledFlagForDomain(domain)
                .then(() => {
                    sendResponse({ ok: true });
                })
                .catch(err => {
                    sendResponse({ ok: false, error: err.message });
                    console.error(err);
                });
            return true;
        }
        case "remove-saved-credentials": {
            const { id } = request;
            removeLogin(id);
            return false;
        }
        case "save-used-credentials": {
            const tabID = sender.tab.id;
            const { credentials } = request;
            const { id } = credentials;
            updateLogin(id, tabID, credentials);
            return false;
        }
        case "search-entries-for-term": {
            const { term } = request;
            Promise.all([getSearch().then(search => search.searchByTerm(term)), getUnlockedSourcesCount()])
                .then(processSearchResults)
                .catch(err => {
                    console.error(err);
                });
            return false;
        }
        case "search-entries-for-url": {
            const { url } = request;
            Promise.all([getSearch().then(search => search.searchByURL(url)), getUnlockedSourcesCount()])
                .then(processSearchResults)
                .catch(err => {
                    console.error(err);
                });
            return false;
        }
        case "send-credentials-to-current-tab": {
            const { sourceID, entryID, signIn } = request;
            sendCredentialsToTab(sourceID, entryID, signIn)
                .then(() => {
                    sendResponse({ ok: true });
                })
                .catch(err => {
                    sendResponse({ ok: false, error: err.message });
                    console.error(err);
                });
            return true;
        }
        case "set-config": {
            dispatch(
                setConfigValue({
                    key: request.key,
                    value: request.value,
                })
            );
        }
        case "set-generated-password": {
            const { password } = request;
            getCurrentTab().then(tab => {
                sendTabMessage(tab.id, {
                    type: "set-generated-password",
                    password,
                });
            });
            lastPassword.value = password;
            return false;
        }
        case "set-user-activity": {
            dispatch(setUserActivity());
            return true;
        }
        case "stop-prompt-saved-credentials": {
            const tabID = sender.tab.id;
            log.info(`Clearing save prompt for current credentials on tab: ${tabID}`);
            stopPromptForTab(tabID);
            return true;
        }
        case "unlock-archive": {
            const { sourceID, masterPassword } = request;
            unlockSource(sourceID, masterPassword)
                .then(() => {
                    sendResponse({ ok: true });
                })
                .catch(err => {
                    console.error(err);
                    sendResponse({ ok: false, error: err.message });
                });
            return true;
        }
        default:
            // Do nothing
            break;
    }
}

async function processSearchResults([entryResults, sources]) {
    const results = await Promise.all(
        entryResults.map(async entryResult => {
            const sourceID = await getSourceIDForVaultID(entryResult.vaultID);
            const sourceName = await getNameForSource(sourceID);
            const entry = await getEntry(sourceID, entryResult.id);
            const facade = createEntryFacade(entry);
            return {
                title: entryResult.properties.title,
                id: entryResult.id,
                entryPath: generateEntryPath(entry),
                facade,
                sourceID,
                sourceName,
                url: entryResult.urls[0] || null,
                urls: entryResult.urls,
            };
        })
    );
    dispatch(setEntrySearchResults(results));
    dispatch(setSourcesCount(sources));
}

export function startMessageListener() {
    chrome.runtime.onMessage.addListener(handleMessage);
}
