import { startMessageListener } from "./library/messaging.js";
import { initialise as initialiseCore } from "./library/core.js";
import log from "../shared/library/log.js";
import { attachBrowserStateListeners } from "./library/browserEvents.js";
import { updateContextMenu } from "./library/contextMenu.js";

log.info("Starting...");

initialiseCore();
startMessageListener();
attachBrowserStateListeners();
updateContextMenu();

log.info("Started successfully");
