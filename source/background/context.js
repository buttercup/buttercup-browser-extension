import { getLoginCredentialsTree } from "./archives";

const CONTEXT_SHARED_PROPERTIES = {
    contexts: [
        "editable"
    ]
};
const NOOP = function() {};

let __contextMenu = null;

function buildMenuCredentialsNode(item, parentId, submit = false, archiveID = null) {
    switch (item.type) {
        case "group":
            /* falls-through */
        case "archive": {
            const newParentId = chrome.contextMenus.create({
                title: item.name,
                parentId,
                ...CONTEXT_SHARED_PROPERTIES
            });
            item.items.forEach(nextItem => buildMenuCredentialsNode(
                nextItem,       // next item info
                newParentId,    // parent ID (context)
                submit,         // auto submit
                archiveID ?     // archive ID
                    archiveID :
                    item.id
            ));
            break;
        }
        case "entry": {
            chrome.contextMenus.create({
                title: item.name,
                parentId,
                onclick: function _handleContextClick() {
                    sendTabMessage({
                        command: "fill-form",
                        comboID: `${archiveID}/${item.id}`,
                        submit
                    });
                },
                ...CONTEXT_SHARED_PROPERTIES
            });
            break;
        }

        default:
            throw new Error(`Failed creating context item: Unknown item type: ${item.type}`);
    }
}

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
    const credentialsTree = getLoginCredentialsTree();
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
        const menuItemEnterCredentials = chrome.contextMenus.create({
            title: "Enter specific credentials",
            ...CONTEXT_SHARED_PROPERTIES,
            parentId: __contextMenu
        });
        const menuItemEnterCredentialsAndLogin = chrome.contextMenus.create({
            title: "Enter specific credentials and login",
            ...CONTEXT_SHARED_PROPERTIES,
            parentId: __contextMenu
        });
        credentialsTree.forEach(item => buildMenuCredentialsNode(item, menuItemEnterCredentials, /* auto submit */ false));
        credentialsTree.forEach(item => buildMenuCredentialsNode(item, menuItemEnterCredentialsAndLogin, /* auto submit */ true));
    }
}
