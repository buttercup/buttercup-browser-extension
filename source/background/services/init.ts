import { init } from "buttercup";
import { EventEmitter } from "eventemitter3";
import { initialiseVaultManager } from "./buttercup.js";
import { initialise as initialiseMessaging } from "./messaging.js";
import { log } from "./log.js";
import { attachTabEventListeners } from "./browser.js";
import { getVaultsAppliance } from "./vaultsAppliance.js";

enum Initialisation {
    Complete = "complete",
    Idle = "idle",
    Running = "running"
}

const __initEE = new EventEmitter();
let __initialisation: Initialisation = Initialisation.Idle;

export async function createOffscreen() {
    if (await chrome.offscreen.hasDocument?.()) return;
    log("creating offscreen document");
    await chrome.offscreen.createDocument({
        url: "offscreen.html",
        reasons: [chrome.offscreen.Reason.USER_MEDIA],
        justification: "Keep service worker running: needed for vaults to remain unlocked"
    });
}

export async function initialise(): Promise<void> {
    if (__initialisation !== Initialisation.Idle) return;
    __initialisation = Initialisation.Running;
    log("initialising");
    initialiseMessaging();
    init();
    global.background = true;
    await getVaultsAppliance().initialise();
    await initialiseVaultManager();
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
