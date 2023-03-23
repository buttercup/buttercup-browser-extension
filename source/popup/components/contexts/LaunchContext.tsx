import React, { ReactNode, createContext } from "react";

interface LaunchContextProps {
    children: ReactNode;
    source: "popup" | "page";
    url?: string;
}

interface LaunchContextDefaultValue {
    source: "popup" | "page";
    url: string | null;
}

export const LaunchContext = createContext<LaunchContextDefaultValue>({} as LaunchContextDefaultValue);
LaunchContext.displayName = "LaunchContext";

export function LaunchContextProvider(props: LaunchContextProps) {
    return (
        <LaunchContext.Provider value={{
            source: props.source,
            url: props.url ?? null
        }}>
            {props.children}
        </LaunchContext.Provider>
    );
}
