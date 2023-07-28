import { useAsync } from "../../shared/hooks/async.js";
import { getVaultsTree } from "../services/vaults.js";
import { VaultsTree } from "../types.js";

export function useAllVaultsContents(): {
    error: Error | null;
    loading: boolean;
    tree: VaultsTree | null;
} {
    const { error, loading, value } = useAsync(getVaultsTree, []);
    return {
        error,
        loading,
        tree: value ?? null
    };
}
