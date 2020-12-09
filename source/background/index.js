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
import store from "./redux/index.js";

log.info("Starting...");
log.info(`Detected browser: ${getBrowser()}`);

watchStorageForConfig(store);
startMessageListener();
attachBrowserStateListeners();
setTimeout(checkUnlockPossibility, 2500);
watchForSourcesAutoLock();
registerAuthWatchers();

migrateLocalStorageToChromeStorage(getQueue())
    .then(() => createArchiveManager())
    .then(() => updateContextMenu());

setInterval(cleanLogins, 30000);
setInterval(updateLoginsState, 5000);

log.info(`Started successfully: v${__VERSION__}`);
