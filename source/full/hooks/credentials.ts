import { useAsync } from "../../shared/hooks/async.js";
import { getCredentials } from "../services/credentials.js";
import { UsedCredentials } from "../types.js";

export function useCapturedCredentials(): [credentials: Array<UsedCredentials>, loading: boolean, error: Error | null] {
    const { error, loading, value } = useAsync(getCredentials, []);
    return [value || [], loading, error];
}
