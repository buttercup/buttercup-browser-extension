import { el, mount, unmount } from "redom";
import { getExtensionURL } from "../../shared/library/extension.js";
import { BRAND_COLOUR_DARK } from "../../shared/symbols.js";

interface LastSaveDialog {
    cleanup: () => void;
    dialog: HTMLElement;
    loginID: string;
}

const CLEAR_STYLES = {
    margin: "0px",
    minWidth: "0px",
    minHeight: "0px",
    padding: "0px"
};
const DIALOG_WIDTH = 380;
const DIALOG_HEIGHT = 230;

let __popup: LastSaveDialog | null = null;

function buildNewSaveDialog(loginID: string) {
    const dialogURL = getExtensionURL(`popup.html#/save-dialog?login=${loginID}`);
    const frame = el("iframe", {
        style: {
            width: "100%",
            height: "100%"
        },
        src: dialogURL,
        frameBorder: "0"
    });
    const container = el(
        "div",
        {
            style: {
                ...CLEAR_STYLES,
                background: "#fff",
                borderRadius: "6px",
                overflow: "hidden",
                border: `2px solid ${BRAND_COLOUR_DARK}`,
                width: `${DIALOG_WIDTH}px`,
                height: `${DIALOG_HEIGHT}px`,
                minWidth: `${DIALOG_WIDTH}px`,
                position: "absolute",
                top: "15px",
                right: "15px",
                zIndex: 9999999
            }
        },
        frame
    );
    mount(document.body, container);
    __popup = {
        cleanup: () => {},
        dialog: container,
        loginID
    };
}

export function closeDialog() {
    if (!__popup) return;
    __popup.cleanup();
    unmount(document.body, __popup.dialog);
    __popup = null;
}

export function openDialog(loginID: string) {
    if (__popup && __popup.loginID === loginID) return;
    if (__popup) {
        closeDialog();
    }
    buildNewSaveDialog(loginID);
}
