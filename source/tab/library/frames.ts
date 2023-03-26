export function findIframeForWindow(url: string): HTMLIFrameElement | null {
    const iframes = [...document.getElementsByTagName("iframe")];
    return iframes.find((frame) => frame.src === url) || null;
}
