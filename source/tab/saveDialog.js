import { el, mount, unmount } from "redom";
import { getExtensionURL } from "../shared/library/extension.js";
import { CLEAR_STYLES } from "./styles.js";

const DIALOG_MARGIN = 10;
const DIALOG_WIDTH = 260;
const DIALOG_HEIGHT = 160;

let __dialog;

function createDialog() {
    const dialogURL = getExtensionURL("dialog.html#/save-new-credentials");
    const frame = el("iframe", {
        style: {
            width: "100%",
            height: "100%"
        },
        src: dialogURL,
        frameBorder: "0"
    });
    return el(
        "div",
        {
            style: {
                ...CLEAR_STYLES,
                width: `${DIALOG_WIDTH}px`,
                height: `${DIALOG_HEIGHT}px`,
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                position: "absolute",
                top: "16px",
                right: "16px",
                zIndex: 9999999
            }
        },
        frame
    );
}

export function hideSaveDialog() {
    if (__dialog) {
        unmount(document.body, __dialog);
        __dialog = null;
    }
}

export function showSaveDialog() {
    if (__dialog) {
        return;
    }
    __dialog = createDialog();
    mount(document.body, __dialog);
}
