import { startStateListener } from "./library/messaging.js";
import { initialise as initialiseCore } from "./library/core.js";
import log from "../shared/library/log.js";

log.info("Starting...");

initialiseCore();
startStateListener();

log.info("Started successfully");
