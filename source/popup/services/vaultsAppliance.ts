import { VaultsAppliance } from "../../shared/services/appliances/VaultsAppliance.js";
import { log } from "./log.js";

let __vaultsAppliance: VaultsAppliance;

export function getVaultsAppliance(): VaultsAppliance {
    if (!__vaultsAppliance) {
        __vaultsAppliance = new VaultsAppliance(log);
    }
    return __vaultsAppliance;
}
