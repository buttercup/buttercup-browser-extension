import { useAsync } from "../../shared/hooks/async.js";
import { getVaultsTree } from "../services/vaults.js";
import { VaultsTree } from "../types.js";

function vaultTreesDiffer(existingValue: VaultsTree, newValue: VaultsTree): boolean {
    if (existingValue === null || newValue === null) return true;
    const existingVaults = Object.keys(existingValue).sort().join(",");
    const newVaults = Object.keys(newValue).sort().join(",");
    if (existingVaults !== newVaults) return true;
    for (const vaultID in existingValue) {
        // Compare groups
        const existingGroupMap = existingValue[vaultID].groups
            .map((group) => `${group.parentID}-${group.id}:${group.title}`)
            .sort()
            .join(",");
        const newGroupMap = newValue[vaultID].groups
            .map((group) => `${group.parentID}-${group.id}:${group.title}`)
            .sort()
            .join(",");
        if (existingGroupMap !== newGroupMap) return true;
    }
    return false;
}

export function useAllVaultsContents(): {
    error: Error | null;
    loading: boolean;
    tree: VaultsTree | null;
} {
    const { error, loading, value } = useAsync(getVaultsTree, [], {
        clearOnExec: false,
        updateInterval: 5000,
        valuesDiffer: vaultTreesDiffer
    });
    return {
        error,
        loading,
        tree: value ?? null
    };
}
