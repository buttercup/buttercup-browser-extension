import { init } from "buttercup";
import { EventEmitter } from "eventemitter3";
import { initialiseVaultManager } from "./buttercup.js";
import { initialise as initialiseMessaging } from "./messaging.js";
import { log } from "./log.js";
import { attachTabEventListeners } from "./browser.js";
import { getVaultsAppliance } from "../../shared/services/vaultsAppliance.js";

enum Initialisation {
    Complete = "complete",
    Idle = "idle",
    Running = "running"
}

const __initEE = new EventEmitter();
let __initialisation: Initialisation = Initialisation.Idle;

export async function initialise(): Promise<void> {
    if (__initialisation !== Initialisation.Idle) return;
    __initialisation = Initialisation.Running;
    log("initialising");
    init();
    global.background = true;
    await getVaultsAppliance().initialise();
    await initialiseVaultManager();
    initialiseMessaging();
    attachTabEventListeners();
    log("initialisation complete");
    __initialisation = Initialisation.Complete;
    __initEE.emit("initialised");
}

export async function waitForInitialisation(): Promise<void> {
    return new Promise<void>((resolve) => {
        if (__initialisation === Initialisation.Complete) return resolve();
        __initEE.once("initialised", resolve);
    });
}
