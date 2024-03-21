import { initialise } from "./services/init.js";
import { log } from "./services/log.js";

// chrome.runtime.onInstalled.addListener(() => {
//     createOffscreen().catch((err) => {
//         console.error(err);
//     });
// });

initialise()
    .then(() => {
        // log(`debug: add url: ${getExtensionURL("full.html#/add")}`);
    })
    .catch((err) => {
        console.error(err);
        log("initialisation failed");
    });
