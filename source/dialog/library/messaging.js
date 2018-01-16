import { dispatch } from "../redux/index.js";
import { setEntireState } from "../../shared/actions/app.js";
import log from "../../shared/library/log.js";
import { getCurrentTab, sendTabMessage } from "../../shared/library/extension.js";

let __backgroundPort = null;

export function closeDialog() {
    return getCurrentTab().then(tab => {
        sendTabMessage(tab.id, {
            type: "close-dialog"
        });
    });
}

export function connectToBackground() {
    __backgroundPort = chrome.runtime.connect({ name: "buttercup-state" });
    __backgroundPort.onMessage.addListener(handleBackgroundMessage);
}

export function searchEntriesForTerm(searchTerm) {
    // log.info(`Searching entries for term: ${searchTerm}`);
    // return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "search-entries-for-term", term: searchTerm });
    // });
}

export function searchEntriesForURL(url) {
    // log.info(`Searching entries for URL: ${url}`);
    // return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "search-entries-for-url", url });
    // });
}

function handleBackgroundMessage(message) {
    switch (message.type) {
        case "action": {
            const { action } = message;
            dispatch(action);
            break;
        }
        case "full-state":
            // log.info("Received full state update from background", message.state);
            dispatch(setEntireState(message.state));
            break;
    }
}

export function sendCredentialsToTab(sourceID, entryID, signIn) {
    chrome.runtime.sendMessage(
        {
            type: "send-credentials-to-current-tab",
            sourceID,
            entryID,
            signIn
        },
        response => {
            if (!response.ok) {
                log.error(`Failed sending credentials to tab: ${response.error}`);
                alert(`An error occurred while trying to fetch credentials: ${response.error}`);
            }
        }
    );
}

export function sendStateUpdate(action) {
    // log.info("Sending state update to background", action);
    try {
        __backgroundPort.postMessage({
            type: "action",
            action
        });
    } catch (err) {
        log.error(`Failed sending action to port: ${err.message}`);
        console.error(err);
    }
}
