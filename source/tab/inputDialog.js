import { el, mount, setStyle, unmount } from "redom";
import scrolling from "scrolling";
import { getExtensionURL } from "../shared/library/extension.js";
import { CLEAR_STYLES } from "./styles.js";
import { onBodyResize } from "./resize.js";

export const DIALOG_TYPE_ENTRY_PICKER = "/";
export const DIALOG_TYPE_PASSWORD_GENERATOR = "/generate-password";

const DIALOG_SIZES = {
    [DIALOG_TYPE_ENTRY_PICKER]: [320, 280],
    [DIALOG_TYPE_PASSWORD_GENERATOR]: [320, 340]
};

let __sharedInstance;

class InputDialog {
    constructor(dialogType) {
        this._input = null;
        this._dialog = createDialog(dialogType);
        mount(document.body, this._dialog);
        this._onScroll = ::this.updatePosition;
        scrolling(document.body, this._onScroll);
        this._onBodyClick = hideInputDialog;
        document.body.addEventListener("click", this._onBodyClick, false);
        const { remove: removeBodyResizeListener } = onBodyResize(::this.updatePosition);
        this._removeBodyResizeListener = removeBodyResizeListener;
    }

    get dialog() {
        return this._dialog;
    }

    get input() {
        return this._input;
    }

    set input(newInput) {
        this._input = newInput;
        this.updatePosition();
    }

    destroy() {
        scrolling.remove(document.body, this._onScroll);
        document.body.removeEventListener("click", this._onBodyClick, false);
        unmount(document.body, this._dialog);
        this._removeBodyResizeListener();
    }

    updatePosition() {
        const { top, left, height } = this.input.getBoundingClientRect();
        setStyle(this.dialog, {
            left: `${left}px`,
            top: `${window.scrollY + top + height + 2}px`
        });
    }
}

function createDialog(dialogType) {
    const dialogURL = getExtensionURL(`dialog.html#${dialogType}`);
    const [width, height] = DIALOG_SIZES[dialogType];
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
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                position: "absolute",
                zIndex: 9999999
            }
        },
        frame
    );
}

export function hideInputDialog() {
    if (__sharedInstance) {
        __sharedInstance.destroy();
        __sharedInstance = null;
    }
}

export function showInputDialog(targetInput, dialogType) {
    if (__sharedInstance) {
        hideInputDialog();
    }
    __sharedInstance = new InputDialog(dialogType);
    __sharedInstance.input = targetInput;
}

export function toggleInputDialog(targetInput, dialogType) {
    if (__sharedInstance) {
        hideInputDialog();
    } else {
        showInputDialog(targetInput, dialogType);
    }
}
