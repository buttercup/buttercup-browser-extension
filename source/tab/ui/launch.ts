import { el, mount, setStyle } from "redom";
import { itemIsIgnored } from "../library/disable.js";
import { CLEAR_STYLES, findBestZIndexInContainer } from "../library/styles.js";
import { onElementDismount } from "../library/dismount.js";
import { onBodyWidthResize } from "../library/resize.js";
import { getExtensionURL } from "../../shared/library/extension.js";
import BUTTON_BACKGROUND_IMAGE_RES from "../../../resources/content-button-background.png";
import INPUT_BACKGROUND_IMAGE_RES from "../../../resources/buttercup-simple-150.png";

const BUTTON_BACKGROUND_IMAGE = getExtensionURL(BUTTON_BACKGROUND_IMAGE_RES);
const INPUT_BACKGROUND_IMAGE = getExtensionURL(INPUT_BACKGROUND_IMAGE_RES);

export function attachLaunchButton(input: HTMLInputElement, onClick: (input: HTMLInputElement) => void) {
    if (input.dataset.bcup === "attached" || itemIsIgnored(input)) {
        return;
    }
    const tryToAttach = () => {
        const bounds = input.getBoundingClientRect();
        const { width } = bounds;
        // Flag has having been attached
        input.dataset.bcup = "attached";
        // Check if we can continue
        if (width <= 0 || !input.offsetParent) {
            setTimeout(tryToAttach, 250);
            return;
        }
        renderButtonStyle(input, () => onClick(input), tryToAttach, bounds);
        // renderInternalStyle(input, () => onClick(input), tryToAttach, bounds);
    };
    tryToAttach();
}

function renderInternalStyle(
    input: HTMLInputElement,
    onClick: () => void,
    reattachCB: () => void,
    inputBounds: DOMRect
) {
    const bounds = inputBounds || input.getBoundingClientRect();
    const { height } = bounds;
    const imageSize = height * 0.6;
    const rightOffset = 8;
    const buttonArea = imageSize + rightOffset + 4;
    setStyle(input, {
        backgroundImage: `url(${INPUT_BACKGROUND_IMAGE})`,
        backgroundSize: `${imageSize}px`,
        backgroundPosition: `right ${rightOffset}px center`,
        backgroundRepeat: "no-repeat",
        paddingRight: `${buttonArea}px`
    });
    input.onclick = (event) => {
        console.log("BUTTON CLICKED", event.target);
        if (event.offsetX >= input.offsetWidth - buttonArea) {
            event.preventDefault();
            event.stopPropagation();
            // toggleInputDialog(input, DIALOG_TYPE_ENTRY_PICKER);
            onClick();
        }
    };
    input.onmousemove = (event) => {
        if (event.offsetX >= input.offsetWidth - buttonArea) {
            setStyle(input, {
                cursor: "pointer"
            });
        } else {
            setStyle(input, {
                cursor: "unset"
            });
        }
    };
}

function renderButtonStyle(input: HTMLInputElement, onClick: () => void, reattachCB: () => void, inputBounds: DOMRect) {
    const bounds = inputBounds || input.getBoundingClientRect();
    const { width, height } = bounds;
    const { borderTopLeftRadius, borderBottomLeftRadius, boxSizing, paddingLeft, paddingRight } =
        window.getComputedStyle(input, null);
    // Calculate button location
    const inputLeftPadding = parseInt(paddingLeft, 10) || 0;
    const inputRightPadding = parseInt(paddingRight, 10) || 0;
    const buttonWidth = 0.8 * height;
    const calculateLeft = () =>
        input.offsetLeft +
        width +
        (boxSizing === "border-box" ? 0 - buttonWidth : inputLeftPadding - inputRightPadding);
    let left = calculateLeft();
    let top = input.offsetTop;
    const buttonZ = findBestZIndexInContainer(input.offsetParent as HTMLElement);
    // Input padding
    setStyle(input, {
        paddingRight: `${inputRightPadding + buttonWidth}px`
    });
    // Update input style
    updateOffsetParentPositioning(input.offsetParent as HTMLElement);
    // Create and add button
    const button = el("button", {
        type: "button",
        tabIndex: -1,
        style: {
            ...CLEAR_STYLES,
            position: "absolute",
            width: `${buttonWidth}px`,
            height: `${height}px`,
            left: `${left}px`,
            top: `${top}px`,
            borderRadius: `0 ${borderTopLeftRadius} ${borderBottomLeftRadius} 0`,
            background: `rgb(0, 183, 172) url(${BUTTON_BACKGROUND_IMAGE})`,
            backgroundSize: `${Math.ceil(buttonWidth / 2)}px`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "50% 50%",
            border: "1px solid rgb(0, 155, 145)",
            cursor: "pointer",
            zIndex: buttonZ,
            outline: "none"
        }
    });
    button.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        // toggleInputDialog(input, DIALOG_TYPE_ENTRY_PICKER);
        onClick();
    };
    mount(input.offsetParent, button);
    onElementDismount(button, () => {
        reattachCB();
    });
    const reprocessButton = () => {
        try {
            left = calculateLeft();
            top = input.offsetTop;
            setStyle(button, {
                top: `${top}px`,
                left: `${left}px`
            });
        } catch (err) {
            clearInterval(reprocessInterval);
            removeOnBodyWidthResize();
        }
    };
    const removeOnBodyWidthResize = onBodyWidthResize(reprocessButton);
    const reprocessInterval = setInterval(reprocessButton, 1250);
    reprocessButton();
}

function updateOffsetParentPositioning(offsetParent: HTMLElement): void {
    const { position: computedPosition } = window.getComputedStyle(offsetParent, null);
    const position = computedPosition || offsetParent.style.position || "static";
    if (position === "static") {
        setStyle(offsetParent, {
            position: "relative"
        });
    }
}
