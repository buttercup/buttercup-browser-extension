import { startMessageListener } from "./library/messaging.js";
import { initialise as initialiseCore } from "./library/core.js";
import log from "../shared/library/log.js";
import { attachBrowserStateListeners } from "./library/browserEvents.js";
import { updateContextMenu } from "./library/contextMenu.js";
import { getBrowser } from "../shared/library/browser.js";
import { checkUnlockPossibility } from "./library/archives.js";
import { watchForSourcesAutoLock } from "./library/autoLock.js";
import { watchStorage as watchStorageForConfig } from "./library/config.js";
import store from "./redux/index.js";

log.info("Starting...");
log.info(`Detected browser: ${getBrowser()}`);

initialiseCore();
watchStorageForConfig(store);
startMessageListener();
attachBrowserStateListeners();
updateContextMenu();
setTimeout(checkUnlockPossibility, 2500);
watchForSourcesAutoLock();

log.info("Started successfully");
