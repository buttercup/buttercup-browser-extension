import { useEffect } from "react";

export function useBodyClass(className: string): void {
    const body = document.body;
    useEffect(() => {
        body.classList.add(className);
        return () => {
            body.classList.remove(className);
        };
    }, [className]);
}
