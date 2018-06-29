import { startMessageListener } from "./library/messaging.js";
import { initialise as initialiseCore } from "./library/core.js";
import log from "../shared/library/log.js";
import { attachBrowserStateListeners } from "./library/browserEvents.js";
import { updateContextMenu } from "./library/contextMenu.js";
import { getBrowser } from "../shared/library/browser.js";
import { checkUnlockPossibility } from "./library/archives.js";

log.info("Starting...");
log.info(`Detected browser: ${getBrowser()}`);

initialiseCore();
startMessageListener();
attachBrowserStateListeners();
updateContextMenu();
setTimeout(checkUnlockPossibility, 2500);

log.info("Started successfully");
