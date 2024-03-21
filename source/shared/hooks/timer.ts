import { useEffect } from "react";
import { DependencyList } from "react";

export function useTimer(callback: () => void, delay: number, dependencies: DependencyList) {
    useEffect(() => {
        const timer = setInterval(callback, delay);
        return () => clearInterval(timer);
    }, dependencies);
}
