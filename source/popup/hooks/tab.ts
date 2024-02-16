import { useMemo } from "react";
import { useAsync } from "../../shared/hooks/async.js";
import { getCurrentTab } from "../../shared/library/extension.js";

export function useCurrentTabURL(): [loading: boolean, url: string | null] {
    const { loading, value } = useAsync(getCurrentTab, [], {
        clearOnExec: false,
        updateInterval: 5000
    });
    const tabURL = useMemo(() => {
        if (!value) return null;
        return value.url ?? null;
    }, [value]);
    return [loading, tabURL];
}
