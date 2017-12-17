export function getTopURL() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            const [tab] = tabs;
            if (!tab) {
                return reject(new Error("Failed to get top URL: No active tab found"));
            }
            return resolve(tab.url);
        });
    });
}
