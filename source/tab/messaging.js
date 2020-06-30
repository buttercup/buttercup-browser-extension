import postRobot from "post-robot";
import { enterLoginDetails, submitLoginForm } from "./login.js";
import { hideInputDialog } from "./inputDialog.js";
import { hideSaveDialog } from "./saveDialog.js";
import { openGeneratorForCurrentInput, setPasswordForCurrentInput } from "./generator.js";
import { autoLogin } from "./autoLogin.js";
import { attemptVaultIDMatch, checkForVaultContainer } from "./myButtercup.js";

export function getConfig() {
    return new Promise(resolve => {
        chrome.runtime.sendMessage({ type: "get-config" }, resp => {
            resolve(resp.config);
        });
    });
}

export function getDisabledSavePromptDomains() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "get-disabled-save-prompt-domains" }, resp => {
            if (resp && resp.domains) {
                resolve(resp.domains);
            } else {
                reject(new Error("Failed getting disable domain prompts"));
            }
        });
    });
}

export function getLastLoginStatus() {
    return new Promise(resolve => {
        chrome.runtime.sendMessage({ type: "get-used-credentials" }, resp => {
            resolve(!!(resp.credentials && resp.credentials.length > 0));
        });
    });
}

export function getSourcesStats() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "get-sources-stats" }, resp => {
            if (resp.ok) {
                return resolve(resp);
            }
            reject(new Error(resp.error || "Unknown error when fetching source stats"));
        });
    });
}

export function getVaults() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "get-vaultsinfo" }, resp => {
            if (resp.ok) {
                return resolve(resp.items);
            }
            reject(new Error(resp.error || "Unknown error when fetching sources info"));
        });
    });
}

function handleMessage(request, sender, sendResponse) {
    switch (request.type) {
        case "auto-login": {
            const { username, password } = request;
            autoLogin(username, password);
            return false;
        }
        case "check-mybcup-vault": {
            const { vaultID } = request;
            attemptVaultIDMatch(vaultID);
            if (!document.hidden) {
                setTimeout(checkForVaultContainer, 500);
            } else {
                const onChange = () => {
                    if (!document.hidden) {
                        document.removeEventListener("visibilitychange", onChange, false);
                        checkForVaultContainer();
                    }
                };
                document.addEventListener("visibilitychange", onChange, false);
            }
            break;
        }
        case "enter-details": {
            const { signIn, entry } = request;
            enterLoginDetails(entry.properties.username, entry.properties.password, signIn);
            return false;
        }
        case "open-generator":
            openGeneratorForCurrentInput();
            break;
        case "set-generated-password":
            setPasswordForCurrentInput(request.password);
            break;
        default:
            // ignore
            break;
    }
}

export function startMessageListeners() {
    chrome.runtime.onMessage.addListener(handleMessage);
    startPostMessageListener();
}

function startPostMessageListener() {
    postRobot.CONFIG.LOG_LEVEL = "error";
    postRobot.on("bcup-close-dialog", () => {
        hideInputDialog();
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
