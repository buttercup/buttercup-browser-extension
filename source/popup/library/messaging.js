import { dispatch } from "../redux/index.js";
import { setEntireState } from "../../shared/actions/app.js";

let __backgroundPort;

export function connectToBackground() {
    __backgroundPort = chrome.runtime.connect({name: "buttercup-state"});
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
            dispatch(setEntireState(message.state));
            break;
    }
}
