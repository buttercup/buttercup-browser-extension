import { el, mount, setStyle, unmount } from "redom";
import { getExtensionURL } from "../../shared/library/extension.js";
import { BRAND_COLOUR_DARK } from "../../shared/symbols.js";
import { onBodyResize } from "../library/resize.js";
import { ElementRect } from "../types.js";

interface LastPopup {
    cleanup: () => void;
    inputRect: ElementRect;
    popup: HTMLElement;
}

const CLEAR_STYLES = {
    margin: "0px",
    minWidth: "0px",
    minHeight: "0px",
    padding: "0px"
};
const POPUP_HEIGHT = 300;
const POPUP_WIDTH = 320;

let __popup: LastPopup | null = null;

function buildNewPopup(inputRect: ElementRect) {
    const popupURL = getExtensionURL("popup.html#/dialog");
    const frame = el("iframe", {
        style: {
            width: "100%",
            height: "100%"
        },
        src: popupURL,
        frameBorder: "0"
    });
    const container = el(
        "div",
        {
            style: {
                ...CLEAR_STYLES,
                backdropFilter: "blur(10px)",
                borderRadius: "6px",
                overflow: "hidden",
                border: `2px solid ${BRAND_COLOUR_DARK}`,
                width: `${POPUP_WIDTH}px`,
                height: `${POPUP_HEIGHT}px`,
                minWidth: `${POPUP_WIDTH}px`,
                position: "absolute",
                zIndex: 9999999
            }
        },
        frame
    );
    mount(document.body, container);
    const removeBodyResizeListener = onBodyResize(() => updatePopupPosition(__popup.inputRect));
    __popup = {
        cleanup: removeBodyResizeListener,
        inputRect,
        popup: container
    };
    updatePopupPosition(inputRect);
}

export function togglePopup(inputRect: ElementRect) {
    if (__popup === null) {
        buildNewPopup(inputRect);
    } else {
        // Tear down
        __popup.cleanup();
        unmount(document.body, __popup.popup);
        __popup = null;
    }
}

export function updatePopupPosition(inputRect: ElementRect): void {
    if (!__popup) return;
    __popup.inputRect = inputRect;
    setStyle(__popup.popup, {
        left: `${inputRect.x}px`,
        top: `${inputRect.y + inputRect.height + 2}px`
    });
}
