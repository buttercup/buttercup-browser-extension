import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DependencyList } from "react";

export interface AsyncResult<T extends any> {
    error: Error | null;
    loading: boolean;
    value: T | null;
}

export function useAsync<T extends any>(
    fn: () => Promise<T>,
    deps: DependencyList = [],
    {
        clearOnExec = true,
        updateInterval = null,
        valuesDiffer = () => true
    }: {
        clearOnExec?: boolean;
        updateInterval?: number | null;
        valuesDiffer?: (existingValue: T | null, newValue: T | null) => boolean;
    } = {}
): AsyncResult<T> {
    const mounted = useRef(false);
    const executing = useRef(false);
    const [value, setValue] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [, setTimer] = useState<null | ReturnType<typeof setTimeout>>(null);
    const execute = useCallback(async () => {
        if (!mounted.current) return;
        if (executing.current) return;
        if (clearOnExec) setValue(null);
        executing.current = true;
        setError(null);
        setLoading((isLoading) => (isLoading === null ? true : isLoading));
        await fn()
            .then((result: T) => {
                executing.current = false;
                if (!mounted.current) return;
                setValue((existing) => {
                    return valuesDiffer(existing, result) ? result : existing;
                });
                setLoading(false);
            })
            .catch((err) => {
                executing.current = false;
                if (!mounted.current) return;
                setError(err);
                setLoading(false);
            });
    }, [fn]);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);
    useEffect(() => {
        if (updateInterval === null) return;
        setTimer((existing) => {
            clearTimeout(existing as any);
            return null;
        });
        let newTimer: ReturnType<typeof setTimeout>;
        const startNewTimer = () => {
            newTimer = setTimeout(() => {
                execute().then(() => {
                    startNewTimer();
                });
            }, updateInterval);
            setTimer(newTimer);
        };
        startNewTimer();
        return () => {
            clearTimeout(newTimer);
        };
    }, [execute, updateInterval]);
    useEffect(() => {
        if (!mounted.current) return;
        execute();
    }, [execute, ...deps]);
    const output = useMemo(
        () => ({
            error,
            loading: typeof loading === "boolean" ? loading : false,
            value
        }),
        [error, loading, value]
    );
    return output;
}

export function useAsyncWithTimer<T extends any>(
    fn: () => Promise<T>,
    delay: number,
    deps: DependencyList = []
): {
    error: Error | null;
    loading: boolean;
    value: T | null;
} {
    const mounted = useRef(false);
    const allTimers = useRef<Array<ReturnType<typeof setInterval>>>([]);
    const [time, setTime] = useState<number>(Date.now());
    const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(null);
    const { error, loading, value } = useAsync(fn, [...deps, time]);
    const [lastValue, setLastValue] = useState(value);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            allTimers.current.forEach((currentTimer) => {
                clearInterval(currentTimer);
            });
        };
    }, []);
    useEffect(() => {
        if (time === 0) return;
        if (error) {
            clearInterval(timer as any);
            setTime(0);
            setTimer(null);
            return;
        }
        if (!timer) {
            const thisTimer = setInterval(() => {
                if (!mounted.current) return;
                setTime(Date.now());
            }, delay);
            allTimers.current.push(thisTimer as any);
            setTimer(thisTimer);
        }
    }, [time, timer, error, delay]);
    useEffect(() => {
        if (value !== null) {
            setLastValue(value);
        }
    }, [value]);
    return {
        error,
        loading,
        value: lastValue
    };
}
