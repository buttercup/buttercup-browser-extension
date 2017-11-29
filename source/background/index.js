import { startMessageListener } from "./library/messaging.js";
import { initialise as initialiseCore } from "./library/core.js";
import log from "../shared/library/log.js";

log.info("Starting...");

initialiseCore();
startMessageListener();

log.info("Started successfully");
