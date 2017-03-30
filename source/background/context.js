const CONTEXT_SHARED_PROPERTIES = {
    contexts: [
        "editable"
    ]
};
const NOOP = function() {};

let __contextMenu = null;

export function hideContextMenu() {
    if (__contextMenu !== null) {
        chrome.contextMenus.remove(__contextMenu);
        __contextMenu = null;
    }
}

export function sendTabMessage(msg) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, msg, NOOP);
    });
}

export function showContextMenu() {
    if (__contextMenu === null) {
        __contextMenu = chrome.contextMenus.create({
            title: "Buttercup",
            ...CONTEXT_SHARED_PROPERTIES
        });
        chrome.contextMenus.create({
            title: "Enter credentials and login",
            parentId: __contextMenu,
            onclick: function() {
                sendTabMessage({
                    command: "fill-form",
                    submit: true
                });
                hideContextMenu();
            },
            ...CONTEXT_SHARED_PROPERTIES
        });
        chrome.contextMenus.create({
            title: "Enter credentials",
            parentId: __contextMenu,
            onclick: function() {
                sendTabMessage({
                    command: "fill-form",
                    submit: false
                });
                hideContextMenu();
            },
            ...CONTEXT_SHARED_PROPERTIES
        });
    }
}
