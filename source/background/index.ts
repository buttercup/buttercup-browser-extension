import { initialise } from "./services/init.js";
import { log } from "./services/log.js";

initialise().catch((err) => {
    console.error(err);
    log("initialisation failed");
});
