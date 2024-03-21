import { initialise as initialiseI18n } from "../../shared/i18n/trans.js";
import { getLanguage } from "../../shared/library/i18n.js";
import { log } from "./log.js";

export async function initialise() {
    log("initialising");
    global.popup = true;
    await initialiseI18n(getLanguage());
    log("initialisation complete");
}
