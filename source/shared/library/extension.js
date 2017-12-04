const NOOP = () => {};

export function createNewTab(url) {
    chrome.tabs.create({ url }, NOOP);
}

export function getExtensionURL(path) {
    return chrome.extension.getURL(path);
}
