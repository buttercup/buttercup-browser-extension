import { el, mount, setStyle } from "redom";
import { getExtensionURL } from "../shared/library/extension.js";
import { getVaults } from "./messaging.js";

const BCUP_MESSAGE_PREFIX = /^bcup_ext_resp:/;
const MYBUTTERCUP_DOMAIN_REXP = /^https?:\/\/(my\.buttercup\.pw|localhost:8000)/;

let __matchedVaultData = null;

async function attemptVaultIDMatch(vaultID) {
    const vaults = await getVaults();
    const matchingVault = vaults.find(vault => vault.meta && vault.meta.vaultID === vaultID);
    if (matchingVault) {
        __matchedVaultData = matchingVault;
    }
}

function buildMyButtercupFrame(container) {
    const frame = el("iframe", {
        style: {
            width: "100%",
            height: "100%"
        },
        src: getExtensionURL(`setup.html#/mybuttercup-vault/${__matchedVaultData.id}`),
        frameBorder: "0"
    });
    mount(container, frame);
    container.dataset.filled = "true";
}

function handleWindowMessageResponse(evt) {
    const { data } = evt;
    if (BCUP_MESSAGE_PREFIX.test(data)) {
        const payload = JSON.parse(data.replace(BCUP_MESSAGE_PREFIX, ""));
        const { type } = payload;
        switch (type) {
            case "reply-vault-id": {
                const { id: vaultID } = payload;
                attemptVaultIDMatch(vaultID);
                break;
            }
            default:
                console.error("Unrecognised message frome extension:", payload);
                break;
        }
    }
}

export function watchForRegistrationPossibility() {
    if (!MYBUTTERCUP_DOMAIN_REXP.test(window.location.href)) {
        return;
    }
    window.addEventListener("message", handleWindowMessageResponse, false);
    window.top.postMessage(
        `bcup_ext:${JSON.stringify({
            type: "get-vault-id"
        })}`,
        "*"
    );
    const checkForVaultContainer = () => {
        const vaultContainerEl = document.getElementById("vaultInjection");
        if (vaultContainerEl && vaultInjection.dataset.filled === "false" && __matchedVaultData) {
            buildMyButtercupFrame(vaultContainerEl);
        }
    };
    checkForVaultContainer();
    const mutationObserverConfig = { attributes: false, childList: true, subtree: true };
    const onMutation = mutations => {
        for (const mutation of mutations) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                checkForVaultContainer();
                break;
            }
        }
    };
    const observer = new MutationObserver(onMutation);
    observer.observe(document.body, mutationObserverConfig);
}
