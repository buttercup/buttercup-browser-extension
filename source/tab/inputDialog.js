import { el, mount, setStyle, unmount } from "redom";
import scrolling from "scrolling";
import { getExtensionURL } from "../shared/library/extension.js";
import { CLEAR_STYLES } from "./styles.js";
import { onBodyResize } from "./resize.js";

export const DIALOG_TYPE_ENTRY_PICKER = "/";
export const DIALOG_TYPE_PASSWORD_GENERATOR = "/generate-password";

const DIALOG_SIZES = {
    [DIALOG_TYPE_ENTRY_PICKER]: [320, 280],
    [DIALOG_TYPE_PASSWORD_GENERATOR]: [320, 324]
};
const DIALOG_STYLING = {
    [DIALOG_TYPE_ENTRY_PICKER]: {},
    [DIALOG_TYPE_PASSWORD_GENERATOR]: {}
};
const DIALOG_MIN_WIDTH = 250;

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
        const { top, left, height, width } = this.input.getBoundingClientRect();
        const buttonWidth = height * 0.8;
        setStyle(this.dialog, {
            left: `${left}px`,
            top: `${window.scrollY + top + height + 2}px`,
            width: `${width + buttonWidth}px`
        });
    }
}

function createDialog(dialogType) {
    const dialogURL = getExtensionURL(`dialog.html#${dialogType}`);
    const [width, height] = DIALOG_SIZES[dialogType];
    const specificStyles = DIALOG_STYLING[dialogType];
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
                minWidth: `${DIALOG_MIN_WIDTH}px`,
                position: "absolute",
                zIndex: 9999999,
                ...specificStyles
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
