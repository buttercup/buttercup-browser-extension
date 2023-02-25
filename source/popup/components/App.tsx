import React from "react";
import { useSingleState } from "react-obstate";
import { Navigator } from "./navigation/Navigator.js";
import { APP_STATE } from "../state/app.js";
import { ThemeProvider } from "../../shared/components/ThemeProvider.js";

export function App() {
    const [tab, setTab] = useSingleState(APP_STATE, "tab");
    return (
        <ThemeProvider darkMode={false}>
            <Navigator
                activeTab={tab}
                onChangeTab={setTab}
            />
        </ThemeProvider>
    );
}
