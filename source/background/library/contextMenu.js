import { createNewTab, getCurrentTab, getExtensionURL, sendTabMessage } from "../../shared/library/extension.js";
import { getBrowser } from "../../shared/library/browser.js";
import { lastPassword } from "./lastGeneratedPassword.js";
import { getFacades, sendCredentialsToTab } from "./archives.js";
import log from "../../shared/library/log.js";

const CONTEXT_SHARED_ALL = {
    contexts: ["all"]
};
const CONTEXT_SHARED_EDITABLE = {
    contexts: getBrowser() === "firefox" ? ["editable", "password"] : ["editable"]
};

let __menu = null,
    __buildPromise = null;

async function buildEntryExplorerMenu(parentMenu, clickHandler) {
    const facades = await getFacades();
    if (facades.length === 0) {
        chrome.contextMenus.create({
            title: "No vaults available",
            parentId: parentMenu,
            enabled: false,
            ...CONTEXT_SHARED_EDITABLE
        });
        return;
    }
    facades.forEach(archiveFacade => {
        const sourceMenu = chrome.contextMenus.create({
            title: `🗃 ${archiveFacade.sourceName}`,
            parentId: parentMenu,
            ...CONTEXT_SHARED_EDITABLE
        });
        if (archiveFacade.groups.length === 0) {
            chrome.contextMenus.create({
                title: "No groups",
                parentId: sourceMenu,
                enabled: false,
                ...CONTEXT_SHARED_EDITABLE
            });
            return;
        }
        archiveFacade.groups.forEach(group => {
            const groupMenu = chrome.contextMenus.create({
                title: `📂 ${group.title}`,
                parentId: sourceMenu,
                ...CONTEXT_SHARED_EDITABLE
            });
            const groupEntries = archiveFacade.entries.filter(entry => entry.parentID === group.id);
            if (groupEntries.length === 0) {
                chrome.contextMenus.create({
                    title: "No entries",
                    parentId: groupMenu,
                    enabled: false,
                    ...CONTEXT_SHARED_EDITABLE
                });
                return;
            }
            groupEntries.forEach(entry => {
                const titleField = entry.fields.find(field => field.property === "title");
                const title = (titleField && titleField.value) || `(Entry ${entry.id})`;
                chrome.contextMenus.create({
                    title,
                    parentId: groupMenu,
                    onclick: () => {
                        clickHandler(archiveFacade.sourceID, entry.id);
                    },
                    ...CONTEXT_SHARED_EDITABLE
                });
            });
        });
    });
}

async function performUpdate() {
    // **
    // ** Init
    // **
    const firstTime = __menu === null;
    if (firstTime) {
        lastPassword.on("valueExpired", updateContextMenu);
        lastPassword.on("valueSet", updateContextMenu);
    }
    const generatedPassword = lastPassword.value;
    // **
    // ** Build menu
    // **
    chrome.contextMenus.removeAll();
    __menu = chrome.contextMenus.create({
        title: "Buttercup",
        ...CONTEXT_SHARED_ALL
    });
    chrome.contextMenus.create({
        title: "About",
        parentId: __menu,
        onclick: () => {
            createNewTab(getExtensionURL("setup.html#/about"));
        },
        ...CONTEXT_SHARED_ALL
    });
    chrome.contextMenus.create({
        parentId: __menu,
        type: "separator",
        ...CONTEXT_SHARED_ALL
    });
    chrome.contextMenus.create({
        title: "Generate password",
        parentId: __menu,
        onclick: () => {
            getCurrentTab()
                .then(tab => tab.id)
                .then(tabID => {
                    sendTabMessage(tabID, {
                        type: "open-generator"
                    });
                });
        },
        ...CONTEXT_SHARED_EDITABLE
    });
    chrome.contextMenus.create({
        title: "Insert last generated password",
        parentId: __menu,
        enabled: lastPassword.expired === false,
        onclick: () => {
            getCurrentTab()
                .then(tab => tab.id)
                .then(tabID => {
                    sendTabMessage(tabID, {
                        type: "set-generated-password",
                        password: generatedPassword
                    });
                });
        },
        ...CONTEXT_SHARED_EDITABLE
    });
    const enterLoginMenu = chrome.contextMenus.create({
        title: "Enter login details",
        parentId: __menu,
        ...CONTEXT_SHARED_EDITABLE
    });
    const autoLoginMenu = chrome.contextMenus.create({
        title: "Log in with",
        parentId: __menu,
        ...CONTEXT_SHARED_EDITABLE
    });
    await buildEntryExplorerMenu(enterLoginMenu, (sourceID, entryID) => {
        sendCredentialsToTab(sourceID, entryID, /* auto login: */ false).catch(err => {
            log.error(`Failed sending credentials to tab: ${err.message}`);
            console.error(err);
        });
    });
    await buildEntryExplorerMenu(autoLoginMenu, (sourceID, entryID) => {
        sendCredentialsToTab(sourceID, entryID, /* auto login: */ true).catch(err => {
            log.error(`Failed sending credentials to tab: ${err.message}`);
            console.error(err);
        });
    });
}

export function updateContextMenu() {
    if (__buildPromise) {
        return __buildPromise;
    }
    __buildPromise = performUpdate().finally(() => {
        __buildPromise = null;
    });
}
