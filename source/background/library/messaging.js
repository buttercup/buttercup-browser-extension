import { createEntryFacade } from "@buttercup/facades";
import * as Buttercup from "../../shared/library/buttercup.js";
import { dispatch, getState } from "../redux/index.js";
import log from "../../shared/library/log.js";
import {
    addArchiveByRequest,
    addNewEntry,
    archiveToObjectGroupsOnly,
    generateEntryPath,
    getArchive,
    getMatchingEntriesForSearchTerm,
    getMatchingEntriesForURL,
    getNameForSource,
    getUnlockedSourcesCount,
    lockSource,
    lockSources,
    openCredentialsPageForEntry,
    removeSource,
    sendCredentialsToTab,
    unlockSource
} from "./archives.js";
import { setEntrySearchResults, setSourcesCount } from "../../shared/actions/searching.js";
import { setAutoLogin } from "../../shared/actions/autoLogin.js";
import { setConfigValue } from "../../shared/actions/app.js";
import { clearLastLogin, getLastLogin, saveLastLogin } from "./lastLogin.js";
import { lastPassword } from "./lastGeneratedPassword.js";
import { createNewTab, getCurrentTab, sendTabMessage } from "../../shared/library/extension.js";
import { getConfig } from "../../shared/selectors/app.js";

const { ENTRY_URL_TYPE_GENERAL, ENTRY_URL_TYPE_ICON, ENTRY_URL_TYPE_LOGIN, getEntryURLs } = Buttercup.tools.entry;

const LAST_LOGIN_MAX_AGE = 0.5 * 60 * 1000; // 30 seconds

function clearSearchResults() {
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
        case "clear-search":
            clearSearchResults();
            return false;
        case "clear-used-credentials":
            clearLastLogin();
            return false;
        case "get-config":
            sendResponse({ config: getConfig(getState()) });
            return false;
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
                        unlocked: unlockedSources
                    });
                })
                .catch(err => {
                    sendResponse({ ok: false, error: err.message });
                    console.error(err);
                });
            return true;
        case "get-used-credentials": {
            const force = !!request.force;
            const currentID = sender.tab.id;
            const lastLogin = getLastLogin();
            if (lastLogin && (lastLogin.tabID === currentID || force)) {
                const now = new Date();
                const lastLoginAge = now - lastLogin.timestamp;
                if (lastLoginAge <= LAST_LOGIN_MAX_AGE || force) {
                    sendResponse({ ok: true, credentials: lastLogin });
                } else {
                    clearLastLogin();
                    sendResponse({ ok: true, credentials: null });
                }
            } else {
                sendResponse({ ok: true, credentials: null });
            }
            return false;
        }
        case "lock-all-archives": {
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
                            tabID: tab.id
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
        case "save-used-credentials": {
            const { credentials } = request;
            const { url, username } = credentials;
            getMatchingEntriesForURL(url)
                .then(entries => entries.filter(entryResult => entryResult.entry.getProperty("username") === username))
                .then(entries => {
                    if (entries.length > 0) {
                        log.info("Provided login details already exist for URL that was requested to be saved.");
                        log.info(`Will not save login credentials from tab: ${sender.tab.id}`);
                    } else {
                        // No existing entries, ok to save
                        log.info(`Saved login credentials from tab: ${sender.tab.id}`);
                        saveLastLogin({
                            ...credentials,
                            tabID: sender.tab.id
                        });
                    }
                });
            return false;
        }
        case "search-entries-for-term": {
            const { term } = request;
            Promise.all([getMatchingEntriesForSearchTerm(term), getUnlockedSourcesCount()])
                .then(processSearchResults)
                .catch(err => {
                    console.error(err);
                });
            return false;
        }
        case "search-entries-for-url": {
            const { url } = request;
            Promise.all([getMatchingEntriesForURL(url), getUnlockedSourcesCount()])
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
        case "set-generated-password": {
            const { password } = request;
            getCurrentTab().then(tab => {
                sendTabMessage(tab.id, {
                    type: "set-generated-password",
                    password
                });
            });
            lastPassword.value = password;
            return false;
        }
        case "unlock-archive": {
            const { sourceID, masterPassword } = request;
            unlockSource(sourceID, masterPassword)
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
                    value: request.value
                })
            );
        }
        default:
            // Do nothing
            break;
    }
}

function processSearchResults([entries, sources]) {
    return Promise.all(
        entries.map(info =>
            getNameForSource(info.sourceID).then(name => ({
                ...info,
                sourceName: name
            }))
        )
    ).then(entries => {
        dispatch(
            setEntrySearchResults(
                entries.map(({ entry, sourceID, sourceName }) => {
                    const facade = createEntryFacade(entry);
                    const urls = getEntryURLs(entry.getProperty(), ENTRY_URL_TYPE_LOGIN);
                    return {
                        title: entry.getProperty("title"),
                        id: entry.id,
                        entryPath: generateEntryPath(entry),
                        sourceID,
                        sourceName,
                        facade,
                        url: urls[0] || null,
                        urls
                    };
                })
            )
        );
        dispatch(setSourcesCount(sources));
    });
}

export function startMessageListener() {
    chrome.runtime.onMessage.addListener(handleMessage);
}
