import { dispatch, getState } from "../redux/index.js";
import log from "../../shared/library/log.js";
import { addPort, getPorts } from "./ports.js";
import {
    addArchiveByRequest,
    archiveToObjectGroupsOnly,
    generateEntryPath,
    getArchive,
    getMatchingEntriesForSearchTerm,
    getMatchingEntriesForURL,
    getNameForSource,
    getUnlockedSourcesCount,
    lockSource,
    lockSources,
    removeSource,
    sendCredentialsToTab,
    unlockSource
} from "./archives.js";
import { setEntrySearchResults, setSourcesCount } from "../../shared/actions/searching.js";
import { clearLastLogin, getLastLogin, saveLastLogin } from "./lastLogin.js";

const LAST_LOGIN_MAX_AGE = 0.5 * 60 * 1000; // 30 seconds

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
        case "clear-used-credentials":
            clearLastLogin();
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
        case "remove-archive": {
            const { sourceID } = request;
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
            saveLastLogin({
                ...credentials,
                tabID: sender.tab.id
            });
            log.info(`Saved login credentials from tab: ${sender.tab.id}`);
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
        default:
            throw new Error(`Unknown message received: ${request.type}`);
    }
}

function handleStateMessage(message) {
    switch (message.type) {
        case "action": {
            const { action } = message;
            log.info(`Received state update action: ${action.type}`);
            dispatch(action);
            break;
        }
        default:
            throw new Error(`Unknown state message received: ${message.type}`);
    }
}

function handleStatePortDisconnect(port) {
    log.info(`Port disconnected: ${port.name}`);
    port.onMessage.removeListener(handleStateMessage);
    port.onDisconnect.removeListener(handleStatePortDisconnect);
    const ports = getPorts("state");
    ports.splice(ports.indexOf(port), 1);
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
                entries.map(({ entry, sourceID, sourceName }) => ({
                    title: entry.getProperty("title"),
                    id: entry.getID(),
                    entryPath: generateEntryPath(entry),
                    sourceID,
                    sourceName,
                    url: entry.getMeta("url") || entry.getMeta("icon")
                }))
            )
        );
        dispatch(setSourcesCount(sources));
    });
}

export function startMessageListener() {
    chrome.runtime.onConnect.addListener(port => {
        log.info(`Port connected: ${port.name}`);
        if (port.name === "buttercup-state") {
            addPort("state", port);
            // first, sync state straight away
            const state = getState();
            port.postMessage({
                type: "full-state",
                state
            });
            log.info("Sent full state to new port", state);
            // listen for state updates
            port.onMessage.addListener(handleStateMessage);
            port.onDisconnect.addListener(handleStatePortDisconnect);
        }
    });
    chrome.runtime.onMessage.addListener(handleMessage);
}
