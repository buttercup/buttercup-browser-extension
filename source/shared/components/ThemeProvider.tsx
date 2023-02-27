import React from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import themesInternal from "../themes.js";
import { ChildElements } from "../types.js";

interface ThemeProviderProps {
    children: ChildElements;
    darkMode: boolean;
}

export function ThemeProvider(props: ThemeProviderProps) {
    const { children, darkMode } = props;
    return (
        <StyledThemeProvider
            theme={{
                ...(darkMode ? themesInternal.dark : themesInternal.light)
            }}
        >
            {children}
        </StyledThemeProvider>
    );
}
