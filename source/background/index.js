import { startMessageListener } from "./library/messaging.js";
import log from "../shared/library/log.js";
import { attachBrowserStateListeners } from "./library/browserEvents.js";
import { updateContextMenu } from "./library/contextMenu.js";
import { getBrowser } from "../shared/library/browser.js";
import { checkUnlockPossibility } from "./library/archives.js";
import { watchForSourcesAutoLock } from "./library/autoLock.js";
import { watchStorage as watchStorageForConfig } from "./library/config.js";
import { createArchiveManager, getQueue, registerAuthWatchers } from "./library/buttercup.js";
import { migrateLocalStorageToChromeStorage } from "./library/storageMigration.js";
import { cleanLogins, updateLoginsState } from "./library/loginMemory.js";
import BrowserStorageInterface, { getSyncStorage } from "./library/BrowserStorageInterface.js";
import store from "./redux/index.js";
import { createNewTab, getExtensionURL } from "../shared/library/extension.js";

log.info("Starting...");
log.info(`Detected browser: ${getBrowser()}`);

migrateLocalStorageToChromeStorage(getQueue())
    .then(() => createArchiveManager())
    .then(() => {
        watchStorageForConfig(store);
        startMessageListener();
        attachBrowserStateListeners();
    })
    .then(() => updateContextMenu())
    .then(() => {
        setTimeout(checkUnlockPossibility, 2500);
        watchForSourcesAutoLock();
        registerAuthWatchers();
        setInterval(cleanLogins, 30000);
        setInterval(updateLoginsState, 5000);
        log.info(`Started successfully: v${__VERSION__}`);
    })
    .then(async () => {
        const storage = new BrowserStorageInterface(getSyncStorage());
        const hasShownUpdateNotice = !!(await storage.getValue("shownV3Update"));
        if (!hasShownUpdateNotice) {
            await storage.setValue("shownV3Update", `${Date.now()}`);
            createNewTab(getExtensionURL("setup.html#/update"));
        }
    })
    .catch(err => {
        log.error(err);
    });
