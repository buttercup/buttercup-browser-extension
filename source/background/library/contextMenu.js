import { createNewTab, getExtensionURL } from "../../shared/library/extension.js";

const CONTEXT_SHARED_ALL = {
    contexts: ["all"]
};
const CONTEXT_SHARED_EDITABLE = {
    contexts: ["editable"]
};

let __menu;

export function updateContextMenu() {
    chrome.contextMenus.removeAll();
    __menu = chrome.contextMenus.create({
        title: "Buttercup",
        ...CONTEXT_SHARED_ALL
    });
    const unlockArchiveMenu = chrome.contextMenus.create({
        title: "Unlock archive",
        parentId: __menu,
        ...CONTEXT_SHARED_ALL
    });
    chrome.contextMenus.create({
        title: "Lock all archives",
        parentId: __menu,
        onclick: () => {
            createNewTab(getExtensionURL("setup.html#/lock-archives"));
        },
        ...CONTEXT_SHARED_ALL
    });
    chrome.contextMenus.create({
        parentId: __menu,
        type: "separator",
        ...CONTEXT_SHARED_ALL
    });
    chrome.contextMenus.create({
        title: "Log in using",
        parentId: __menu,
        onclick: () => {
            // todo
        },
        enabled: false,
        ...CONTEXT_SHARED_ALL
    });
    chrome.contextMenus.create({
        title: "Enter login details",
        parentId: __menu,
        onclick: () => {
            // todo
        },
        enabled: false,
        ...CONTEXT_SHARED_ALL
    });
    chrome.contextMenus.create({
        title: "Generate password",
        parentId: __menu,
        onclick: () => {
            // todo
        },
        ...CONTEXT_SHARED_EDITABLE
    });
}
