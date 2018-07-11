import { dispatch } from "../redux/index.js";
import { setEntireState } from "../../shared/actions/app.js";
import log from "../../shared/library/log.js";

let __backgroundPort = null;

export function clearSearchResults() {
    chrome.runtime.sendMessage({ type: "clear-search" });
}

export function connectToBackground() {
    __backgroundPort = chrome.runtime.connect({ name: "buttercup-state" });
    __backgroundPort.onMessage.addListener(handleBackgroundMessage);
}

function handleBackgroundMessage(message) {
    switch (message.type) {
        case "action": {
            const { action } = message;
            dispatch(action);
            break;
        }
        case "full-state":
            log.info("Received full state update from background", message.state);
            dispatch(setEntireState(message.state));
            break;
    }
}

export function requestCredentialsOpening(sourceID, entryID) {
    chrome.runtime.sendMessage({
        type: "open-credentials-url",
        sourceID,
        entryID
    });
}

export function sendStateUpdate(action) {
    log.info("Sending state update to background", action);
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
