import { dispatch, getState } from "../redux/index.js";
import log from "../../shared/library/log.js";
import { addPort, getPorts } from "./ports.js";

function handleStateMessage(message) {
    switch (message.type) {
        case "action": {
            const { action } = message;
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

export function startStateListener() {
    console.log("SP", this);
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
}
