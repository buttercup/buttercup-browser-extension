import { dispatch } from "../redux/index.js";
import { setEntireState } from "../../shared/actions/app.js";
import log from "../../shared/library/log.js";

let __backgroundPort = null;

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
        default:
            log.error(`Unknown message received: ${JSON.stringify(message)}`);
            break;
    }
}

export function lockAllArchives() {
    log.info("Sending request to background to lock all archives");
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "lock-all-archives" }, response => {
            const { ok, error } = response;
            if (ok) {
                return resolve();
            }
            return reject(new Error(`Locking archives failed: ${error}`));
        });
    });
}

export function lockArchive(sourceID) {
    log.info(`Sending request to background to lock archive source: ${sourceID}`);
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "lock-archive", sourceID }, response => {
            const { ok, error } = response;
            if (ok) {
                return resolve();
            }
            return reject(new Error(`Locking archive failed: ${error}`));
        });
    });
}

export function makeArchiveAdditionRequest(payload) {
    log.info("Making request to background for storing a new archive");
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "add-archive", payload }, response => {
            const { ok, error } = response;
            if (ok) {
                return resolve();
            }
            return reject(new Error(`Adding archive failed: ${error}`));
        });
    });
}

export function removeArchive(sourceID) {
    log.info(`Sending request to background for the removal of archive source: ${sourceID}`);
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "remove-archive", sourceID }, response => {
            const { ok, error } = response;
            if (ok) {
                return resolve();
            }
            return reject(new Error(`Adding removal failed: ${error}`));
        });
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

export function unlockArchive(sourceID, masterPassword) {
    log.info(`Making request to background to unlock archive source: ${sourceID}`);
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "unlock-archive", sourceID, masterPassword }, response => {
            const { ok, error } = response;
            if (ok) {
                return resolve();
            }
            return reject(new Error(`Unlocking archive source (${sourceID}) failed: ${error}`));
        });
    });
}
