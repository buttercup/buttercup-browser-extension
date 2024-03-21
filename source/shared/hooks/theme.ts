import { useEffect } from "react";
import { useConfig } from "./config.js";
import { Classes } from "@blueprintjs/core";

let __bodyThemeAttached: boolean = false;

export function useBodyThemeClass(theme: "dark" | "light"): void {
    useEffect(() => {
        if (__bodyThemeAttached) {
            console.warn("Multiple body theme controllers running");
            return;
        }
        __bodyThemeAttached = true;
        if (theme === "dark") {
            document.body.classList.add(Classes.DARK);
        } else {
            document.body.classList.remove(Classes.DARK);
        }
        return () => {
            __bodyThemeAttached = false;
        };
    }, [theme]);
}

export function useTheme(): "dark" | "light" {
    const [config] = useConfig();
    if (!config || config.useSystemTheme) {
        const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
        return darkThemeMq.matches ? "dark" : "light";
    }
    return config?.theme === "dark" ? "dark" : "light";
}
