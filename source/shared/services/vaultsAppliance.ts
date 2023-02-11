import { VaultsAppliance } from "./appliances/VaultsAppliance.js";

let __vaultsAppliance: VaultsAppliance;

export function getVaultsAppliance(): VaultsAppliance {
    if (!__vaultsAppliance) {
        __vaultsAppliance = new VaultsAppliance();
    }
    return __vaultsAppliance;
}
