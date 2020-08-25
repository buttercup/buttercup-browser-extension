export function getBrowser() {
    const isChromium = window.chrome;
    const winNav = window.navigator;
    const vendorName = winNav.vendor;
    const isOpera = typeof window.opr !== "undefined";
    const isIEedge = winNav.userAgent.indexOf("Edge") > -1;

    if (
        isChromium !== null &&
        typeof isChromium !== "undefined" &&
        vendorName === "Google Inc." &&
        isOpera === false &&
        isIEedge === false
    ) {
        return "chrome";
    } else if (navigator.userAgent.toLowerCase().indexOf("firefox") >= 0) {
        return "firefox";
    }
    return "";
}

export function writeToClipboard(text) {
    return navigator.clipboard.writeText(text);
}
