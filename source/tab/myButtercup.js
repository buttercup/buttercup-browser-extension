import { el, mount, setStyle } from "redom";
import { getExtensionURL } from "../shared/library/extension.js";

const MYBUTTERCUP_DOMAIN_REXP = /^https?:\/\/(my\.buttercup\.pw|localhost:8000)/;

let __watchInterval;

function buildMyButtercupFrame(container) {
    const frame = el("iframe", {
        style: {
            width: "100%",
            height: "100%"
        },
        src: getExtensionURL(`setup.html#/access-archive/${"f3b91f9b-4f7e-475f-968d-b7d656f97239"}/unlocked`),
        frameBorder: "0"
    });
    mount(container, frame);
    container.dataset.filled = "true";
}

export function watchForRegistrationPossibility() {
    if (!MYBUTTERCUP_DOMAIN_REXP.test(window.location.href)) {
        return;
    }
    const presenceEl = document.createElement("div");
    presenceEl.id = "bcupExtPresence";
    presenceEl.setAttribute("style", "display: none");
    document.body.appendChild(presenceEl);
    __watchInterval = setInterval(() => {
        const targetContainer = document.getElementById("vaultInjection");
        if (targetContainer && targetContainer.dataset.filled === "false") {
            buildMyButtercupFrame(targetContainer);
        }
    }, 250);
}
