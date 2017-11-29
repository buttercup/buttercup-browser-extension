import { dispatch, getState } from "../redux/index.js";
import log from "../../shared/library/log.js";
import { addPort, getPorts } from "./ports.js";
import { addArchiveByRequest } from "./archives.js";

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
