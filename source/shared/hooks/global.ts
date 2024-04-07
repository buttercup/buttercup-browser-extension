import EventEmitter from "eventemitter3";
import { useCallback, useEffect, useState } from "react";

interface Globals {
    configFlagTs: number | null;
}

const __globals: Globals = {
    configFlagTs: null
};
let __ee: EventEmitter | null = null;

export function useGlobal<K extends keyof Globals>(key: K): [Globals[K], (value: Globals[K]) => void] {
    useEffect(() => {
        if (!__ee) {
            __ee = new EventEmitter();
        }
    }, []);
    const handleEventUpdate = useCallback(() => {
        setCurrentValue(__globals[key]);
    }, [key]);
    useEffect(() => {
        if (!__ee) return;
        handleEventUpdate();
        __ee.on("update", handleEventUpdate);
        return () => {
            if (!__ee) return;
            __ee.off("update", handleEventUpdate);
        };
    }, [handleEventUpdate]);
    const [currentValue, setCurrentValue] = useState<Globals[K]>(__globals[key]);
    const handleValueChange = useCallback(
        (value: Globals[K]) => {
            __globals[key] = value;
            setCurrentValue(value);
            if (__ee) {
                __ee.emit("update");
            }
        },
        [key]
    );
    return [currentValue, handleValueChange];
}
