import { getExtensionURL } from "../shared/library/extension.js";
import { initialise } from "./services/init.js";
import { log } from "./services/log.js";

initialise()
    .then(() => {
        // log(`debug: add url: ${getExtensionURL("full.html#/add")}`);
    })
    .catch((err) => {
        console.error(err);
        log("initialisation failed");
    });
