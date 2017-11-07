import { dispatch, getState } from "../redux/index.js";

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

export function startStateListener() {
    chrome.runtime.onConnect.addListener(port => {
        if (port.name === "buttercup-state") {
            // first, sync state straight away
            const state = getState();
            port.postMessage({
                type: "full-state",
                state
            });
            // listen for state updates
            port.onMessage.addListener(handleStateMessage);
        }
    });
}
