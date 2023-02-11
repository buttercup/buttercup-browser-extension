import { initialise as initialiseI18n } from "../../shared/i18n/trans.js";
import { getLanguage } from "../../shared/library/i18n.js";
import { getVaultsAppliance } from "../../shared/services/vaultsAppliance.js";
import { log } from "./log.js";

export async function initialise() {
    log("initialising");
    await initialiseI18n(getLanguage());
    await getVaultsAppliance().initialise();
    log("initialisation complete");
}
