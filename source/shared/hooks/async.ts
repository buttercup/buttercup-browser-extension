import { useCallback, useEffect, useRef, useState } from "react";
import type { DependencyList } from "react";

export function useAsync<T extends any>(
    fn: () => Promise<T>,
    deps: DependencyList = []
): {
    error: Error | null;
    value: T | null;
} {
    const mounted = useRef(false);
    const [value, setValue] = useState<T>(null);
    const [error, setError] = useState<Error>(null);
    const execute = useCallback(async () => {
        setValue(null);
        setError(null);
        return fn()
            .then((result: T) => {
                if (!mounted.current) return;
                setValue(result);
            })
            .catch((err) => {
                if (!mounted.current) return;
                setError(err);
            });
    }, [fn]);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);
    useEffect(() => {
        execute();
    }, [execute, ...deps]);
    return { error, value };
}
