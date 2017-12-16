import { el, mount, setStyle } from "redom";
import { CLEAR_STYLES, findBestZIndexInContainer } from "./styles.js";

const BUTTON_BACKGROUND_IMAGE = require("../../resources/content-button-background.png");

// const TRANSPARENT_BG = /(rgba\(\d+, ?\d+, ?\d+, ?0\)|transparent)/;

export function attachLaunchButton(input) {
    console.log("ATTACH", input);
    // const { height: rawHeight, width: rawWidth, zIndex: zIndexRaw, backgroundColor } = window.getComputedStyle(input, null);
    // const height = Math.max(parseInt(rawHeight, 10), 14);
    // const buttonSize = height * 2;
    // const width = parseInt(rawWidth, 10);
    // const zIndex = parseInt(zIndexRaw, 10) || 1;
    // const targetZIndex = zIndex <= 1 ? 1 : zIndex - 1;
    // if (targetZIndex === 1) {
    //     input.style.zIndex = targetZIndex + 1;
    // }
    // console.log("WTF", backgroundColor);
    // if (backgroundColor && TRANSPARENT_BG.test(backgroundColor)) {
    //     input.style.backgroundColor = "#fff";
    // }
    // const left = input.offsetLeft + width - (buttonSize / 2);
    // const top = input.offsetTop - (height / 2);
    // const button = el(
    //     "div",
    //     {
    //         style: {
    //             width: `${buttonSize}px`,
    //             height: `${buttonSize}px`,
    //             borderRadius: `${buttonSize}px`,
    //             backgroundColor: "rgb(0, 183, 172)",
    //             position: "absolute",
    //             left: `${left}px`,
    //             top: `${top}px`,
    //             zIndex: targetZIndex
    //         }
    //     }
    // );
    // mount(input.parentNode, button);
    const { height: rawHeight, width: rawWidth, zIndex: zIndexRaw, backgroundColor } = window.getComputedStyle(
        input,
        null
    );
    const height = Math.max(parseInt(rawHeight, 10), 14);
    const width = parseInt(rawWidth, 10);
    const buttonWidth = 0.8 * height;
    const newInputWidth = width - buttonWidth;
    const left = input.offsetLeft + newInputWidth;
    const top = input.offsetTop;
    const buttonZ = findBestZIndexInContainer(input.offsetParent);
    // Update input style
    setStyle(input, {
        width: `${newInputWidth}px`
    });
    // Create and add button
    const button = el("button", {
        style: {
            ...CLEAR_STYLES,
            position: "absolute",
            width: `${buttonWidth}px`,
            height: `${height}px`,
            left: `${left}px`,
            top: `${top}px`,
            borderRadius: "0px",
            background: `rgb(0, 183, 172) url(${BUTTON_BACKGROUND_IMAGE})`,
            backgroundSize: `${buttonWidth / 2}px`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "50% 50%",
            border: "1px solid rgb(0, 155, 145)",
            cursor: "pointer",
            zIndex: buttonZ
        }
    });
    mount(input.offsetParent, button);
}
