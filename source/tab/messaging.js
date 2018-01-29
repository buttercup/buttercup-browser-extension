import postRobot from "post-robot";
import { enterLoginDetails, submitLoginForm } from "./login.js";
import { hideSearchDialog } from "./dialog.js";

function handleMessage(request, sender, sendResponse) {
    switch (request.type) {
        case "enter-details": {
            const { signIn, entry } = request;
            enterLoginDetails(entry.properties.username, entry.properties.password, signIn);
            return false;
        }
        default:
            throw new Error(`Unknown message received: ${request.type}`);
    }
}

export function startMessageListeners() {
    chrome.runtime.onMessage.addListener(handleMessage);
    startPostMessageListener();
}

function startPostMessageListener() {
    postRobot.on("bcup-close-dialog", () => {
        hideSearchDialog();
    });
    postRobot.on("bcup-get-url", () => window.location.href);
}

export function transferLoginCredentials(details) {
    chrome.runtime.sendMessage({ type: "save-used-credentials", credentials: details });
}
