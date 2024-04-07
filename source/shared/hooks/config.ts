import { useCallback, useState } from "react";
import { useAsync } from "./async.js";
import { getConfig } from "../queries/config.js";
import { setConfigValue as setNewBackgroundValue } from "../queries/config.js";
import { Configuration } from "../types.js";
import { useGlobal } from "./global.js";

export function useConfig(): [
    Configuration | null,
    Error | null,
    <T extends keyof Configuration>(setKey: T, value: Configuration[T]) => void
] {
    const [ts, setTs] = useGlobal("configFlagTs");
    const { value, error } = useAsync(getConfig, [ts], {
        clearOnExec: false
    });
    const [changeError, setChangeError] = useState<Error | null>(null);
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
