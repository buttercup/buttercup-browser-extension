import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

export function useAsyncWithTimer<T extends any>(
    fn: () => Promise<T>,
    delay: number,
    deps: DependencyList = []
): {
    error: Error | null;
    value: T | null;
} {
    const [time, setTime] = useState<number>(Date.now());
    const [timer, setTimer] = useState<ReturnType<typeof setInterval>>(null);
    const { error, value } = useAsync(fn, [...deps, time]);
    const [lastValue, setLastValue] = useState(value);
    useEffect(() => {
        if (time === 0) return;
        if (error) {
            clearInterval(timer);
            setTime(0);
            setTimer(null);
            return;
        }
        if (!timer) {
            setTimer(
                setInterval(() => {
                    setTime(Date.now());
                }, delay)
            );
        }
    }, [time, timer, error, delay]);
    useEffect(() => {
        if (value !== null) {
            setLastValue(value);
        }
    }, [value]);
    return {
        error,
        value: lastValue
    };
}
