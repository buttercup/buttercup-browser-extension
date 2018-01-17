import { startMessageListener } from "./library/messaging.js";
import { initialise as initialiseCore } from "./library/core.js";
import log from "../shared/library/log.js";
import { attachBrowserStateListeners } from "./library/browserEvents.js";

log.info("Starting...");

initialiseCore();
startMessageListener();
attachBrowserStateListeners();

log.info("Started successfully");
