import { dispatch, getState } from "../redux/index.js";
import log from "../../shared/library/log.js";
import { addPort, getPorts } from "./ports.js";
import {
    addArchiveByRequest,
    getMatchingEntriesForURL,
    getUnlockedSourcesCount,
    lockSource,
    lockSources,
    removeSource,
    unlockSource
} from "./archives.js";
import { setEntrySearchResults, setSourcesCount } from "../../shared/actions/searching.js";

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
        case "search-entries-for-url": {
            const { url } = request;
            Promise.all([getMatchingEntriesForURL(url), getUnlockedSourcesCount()])
                .then(([entries, sources]) => {
                    dispatch(
                        setEntrySearchResults(
                            entries.map(({ entry, sourceID }) => ({
                                title: entry.getProperty("title"),
                                id: entry.getID(),
                                sourceID,
                                url: entry.getMeta("url") || entry.getMeta("icon")
                            }))
                        )
                    );
                    dispatch(setSourcesCount(sources));
                })
                .catch(err => {
                    console.error(err);
                });
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

export function startMessageListener() {
    chrome.runtime.onConnect.addListener(port => {
        log.info(`Port connected: ${port.name}`);
        if (port.name === "buttercup-state") {
            // __statePorts.push(port);
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
