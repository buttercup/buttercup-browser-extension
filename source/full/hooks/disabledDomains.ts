import { useAsyncWithTimer } from "../../shared/hooks/async.js";
import { getDisabledDomains } from "../services/disabledDomains.js";

const REFRESH_DELAY = 2500;

export function useDisabledDomains(
    deps: React.DependencyList = []
): [domains: Array<string>, loading: boolean, error: Error | null] {
    const { error, loading, value } = useAsyncWithTimer(getDisabledDomains, REFRESH_DELAY, deps);
    return [value || [], loading, error];
}
