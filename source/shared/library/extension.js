const NOOP = () => {};

export function createNewTab(url) {
    chrome.tabs.create({ url }, NOOP);
}

export function getCurrentTab() {
    return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            resolve(tabs[0]);
        });
    });
}

export function getExtensionURL(path) {
    return chrome.extension.getURL(path);
}

export function sendTabMessage(tabID, message) {
    return new Promise(resolve => {
        chrome.tabs.sendMessage(tabID, message, response => {
            resolve(response);
        });
    });
}
