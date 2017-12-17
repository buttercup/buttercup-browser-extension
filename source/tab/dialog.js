import { el, mount, setStyle, unmount } from "redom";
import scrolling from "scrolling";
import { getExtensionURL } from "../shared/library/extension.js";
import { CLEAR_STYLES } from "./styles.js";

let __sharedInstance;

class SearchDialog {
    constructor() {
        this._input = null;
        this._dialog = createDialog();
        mount(document.body, this._dialog);
        this._onScroll = ::this.updatePosition;
        scrolling(document.body, this._onScroll);
        this._onBodyClick = hideSearchDialog;
        document.body.addEventListener("click", this._onBodyClick, false);
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
    }

    updatePosition() {
        const { top, left, height } = this.input.getBoundingClientRect();
        setStyle(this.dialog, {
            left: `${left}px`,
            top: `${window.scrollY + top + height + 2}px`
        });
    }
}

function createDialog() {
    const dialogURL = getExtensionURL("dialog.html");
    console.log("URL", dialogURL);
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
                width: "320px",
                height: "280px",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                position: "absolute",
                zIndex: 9999999
            }
        },
        frame
    );
}

export function hideSearchDialog() {
    if (__sharedInstance) {
        __sharedInstance.destroy();
        __sharedInstance = null;
    }
}

export function showSearchDialog(targetInput) {
    if (__sharedInstance) {
        hideSearchDialog();
    }
    __sharedInstance = new SearchDialog();
    __sharedInstance.input = targetInput;
}

export function toggleSearchDialog(targetInput) {
    if (__sharedInstance) {
        hideSearchDialog();
    } else {
        showSearchDialog(targetInput);
    }
}