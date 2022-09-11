import { init } from "buttercup";
import { initialiseVaultManager } from "./buttercup.js";
import { log } from "./log.js";

export async function initialise() {
    log("init");
    init();
    await initialiseVaultManager();
}
