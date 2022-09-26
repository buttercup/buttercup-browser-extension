import { init } from "buttercup";
import { initialiseVaultManager } from "./buttercup.js";
import { initialise as initialiseMessaging } from "./messaging.js";
import { log } from "./log.js";
import { attachTabEventListeners } from "./browser.js";

export async function initialise() {
    log("initialising");
    init();
    await initialiseVaultManager();
    initialiseMessaging();
    attachTabEventListeners();
    log("initialisation complete");
}
