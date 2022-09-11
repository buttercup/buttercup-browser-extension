import { getExtensionURL } from "../shared/library/extension.js";
import { initialise } from "./services/init.js";
import { log } from "./services/log.js";

initialise()
    .then(() => {
        log("initialisation complete");
        log(`Add URL: ${getExtensionURL("full.html#/add")}`);
    })
    .catch((err) => {
        console.error(err);
        log("initialisation failed");
    });
