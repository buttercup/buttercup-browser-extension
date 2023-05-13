import { useCallback, useState } from "react";
import { useAsync } from "../../shared/hooks/async.js";
import { getConfig } from "../queries/config.js";
import { setConfigValue as setNewBackgroundValue } from "../queries/config.js";
import { Configuration } from "../types.js";

export function useConfig(): [
    Configuration | null,
    Error | null,
    <T extends keyof Configuration>(setKey: T, value: Configuration[T]) => void
] {
    const [ts, setTs] = useState(() => Date.now());
    const { value, error } = useAsync(getConfig, [ts]);
    const [changeError, setChangeError] = useState<Error>(null);
    const setConfigValue = useCallback(<T extends keyof Configuration>(setKey: T, value: Configuration[T]) => {
        setChangeError(null);
        setNewBackgroundValue(setKey, value)
            .then(() => {
                setTs(Date.now());
            })
            .catch((err) => {
                console.error(err);
                setChangeError(err);
            });
    }, []);
    return [value || null, changeError || error, setConfigValue];
}
