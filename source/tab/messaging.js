import postRobot from "post-robot";
import { enterLoginDetails, submitLoginForm } from "./login.js";
import { hideSearchDialog } from "./searchDialog.js";
import { hideSaveDialog } from "./saveDialog.js";

export function getLastLoginStatus() {
    return new Promise(resolve => {
        chrome.runtime.sendMessage({ type: "get-used-credentials" }, resp => {
            resolve(
                resp && !!resp.credentials
                    ? {
                          credentials: true,
                          title: resp.credentials.title
                      }
                    : {
                          credentials: false
                      }
            );
        });
    });
}

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
        hideSaveDialog();
    });
    postRobot.on("bcup-get-url", () => window.location.href);
    postRobot.on("bcup-open-url", event => {
        const { url } = event.data;
        chrome.runtime.sendMessage({ type: "open-tab", url });
    });
}

export function transferLoginCredentials(details) {
    chrome.runtime.sendMessage({ type: "save-used-credentials", credentials: details });
}
