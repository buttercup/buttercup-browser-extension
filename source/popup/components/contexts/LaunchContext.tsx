import React, { ReactNode, createContext } from "react";

interface LaunchContextProps {
    children: ReactNode;
    formID?: string;
    source: "popup" | "page";
    url?: string;
}

interface LaunchContextDefaultValue {
    formID: string | null;
    source: "popup" | "page";
    url: string | null;
}

export const LaunchContext = createContext<LaunchContextDefaultValue>({} as LaunchContextDefaultValue);
LaunchContext.displayName = "LaunchContext";

export function LaunchContextProvider(props: LaunchContextProps) {
    return (
        <LaunchContext.Provider value={{
            formID: props.formID ?? null,
            source: props.source,
            url: props.url ?? null
        }}>
            {props.children}
        </LaunchContext.Provider>
    );
}
