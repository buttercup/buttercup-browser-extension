import { useCallback } from "react";
import { useAsync } from "../../shared/hooks/async.js";
import { getDesktopConnectionAvailable, getVaultSources } from "../queries/desktop.js";
import { VaultSourceDescription } from "../types.js";

export function useDesktopConnectionAvailable(): boolean | null {
    const checkConnection = useCallback(async () => {
        const isAvailable = await getDesktopConnectionAvailable();
        return isAvailable;
    }, []);
    const { value } = useAsync(checkConnection, [checkConnection]);
    return value === null ? false : value;
}

export function useVaultSources(): Array<VaultSourceDescription> {
    const getSources = useCallback(getVaultSources, []);
    const { value: sources } = useAsync(getSources, [getSources]);
    return sources === null ? [] : sources;
}
