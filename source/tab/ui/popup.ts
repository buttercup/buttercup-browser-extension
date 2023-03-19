import { ElementRect } from "../types.js";

export function renderPopup(inputRect: ElementRect) {
    console.log("RENDER POPUP", inputRect);
    const temp = document.createElement("div");
    Object.assign(temp.style, {
        position: "absolute",
        left: `${inputRect.x}px`,
        top: `${inputRect.y}px`,
        width: `${inputRect.width}px`,
        height: `${inputRect.height}px`,
        backgroundColor: "rgba(255,0,0,0.2)"
    });
    document.body.appendChild(temp);
}
