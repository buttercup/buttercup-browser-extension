import { useEffect, useMemo, useState } from "react";
import type { VaultsAppliance } from "../services/appliances/VaultsAppliance.js";
import { VaultSourceDescription } from "../types.js";

export function useVaultSources(appliance: VaultsAppliance): Array<VaultSourceDescription> {
    const initialState = useMemo(() => appliance.getProperty("vaults"), []);
    const [sources, setSources] = useState<Array<VaultSourceDescription>>(initialState);
    useEffect(() => {
        const update = (key: string | null) => {
            if (key === null || key === "vaults") {
                setSources(appliance.getProperty("vaults"));
            }
        };
        appliance.on("updated", update);
        return () => {
            appliance.off("updated", update);
        };
    }, [appliance]);
    return sources;
}
