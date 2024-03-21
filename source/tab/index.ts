import { FRAME } from "./state/frame.js";
import { initialise } from "./services/init.js";
import { log } from "./services/log.js";

FRAME.isTop = window.parent === window;

initialise().catch((err) => {
    console.error(err);
    log(`initialisation failed: ${err.message}`);
});
