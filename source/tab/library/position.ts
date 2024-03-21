import { ElementRect } from "../types.js";

export function getElementRectInDocument(el: HTMLElement): ElementRect {
    const boundingRect = el.getBoundingClientRect();
    return {
        x: boundingRect.left + document.documentElement.scrollLeft,
        y: boundingRect.top + document.documentElement.scrollTop,
        width: boundingRect.width,
        height: boundingRect.height
    };
}

export function recalculateRectForIframe(rect: ElementRect, iframe: HTMLIFrameElement): ElementRect {
    const framePos = getElementRectInDocument(iframe);
    return {
        ...rect,
        x: framePos.x + rect.x,
        y: framePos.y + rect.y
    };
}
