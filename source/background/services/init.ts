import { init } from "buttercup";
import { initialiseVaultManager } from "./buttercup.js";
import { initialise as initialiseMessaging } from "./messaging.js";
import { log } from "./log.js";
import { attachTabEventListeners } from "./browser.js";
import { getVaultsAppliance } from "../../shared/services/vaultsAppliance.js";

export async function initialise() {
    log("initialising");
    init();
    global.background = true;
    await getVaultsAppliance().initialise();
    await initialiseVaultManager();
    initialiseMessaging();
    attachTabEventListeners();
    log("initialisation complete");
}
