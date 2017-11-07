import { startStateListener } from "./library/messaging.js";
import { initialise as initialiseCore } from "./library/core.js";

initialiseCore();
startStateListener();
