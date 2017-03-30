export function hideContextMenu() {
    chrome.runtime.sendMessage({ command: "toggle-context", enabled: false }, function(response) {
        if (response && response.ok) {
            // no problem
        } else {
            throw new Error("Failed toggling context menu (hide)");
        }
    });
}

export function showContextMenu() {
    chrome.runtime.sendMessage({ command: "toggle-context", enabled: true }, function(response) {
        if (response && response.ok) {
            // no problem
        } else {
            throw new Error("Failed toggling context menu (show)");
        }
    });
}
