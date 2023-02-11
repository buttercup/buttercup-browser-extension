import { useEffect, useMemo, useState } from "react";
import { getVaultsAppliance } from "../services/vaultsAppliance.js";
import { VaultSourceDescription } from "../types.js";

export function useVaultSources(appliance = getVaultsAppliance()): Array<VaultSourceDescription> {
    const initialState = useMemo(() => appliance.getProperty("vaults"), []);
    const [sources, setSources] = useState<Array<VaultSourceDescription>>(initialState);
    useEffect(() => {
        const update = () => {
            setSources(appliance.getProperty("vaults"));
        };
        appliance.on("updated", update);
        return () => {
            appliance.off("updated", update);
        };
    }, [appliance]);
    return sources;
}
