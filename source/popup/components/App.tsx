import React from "react";
import {
    createHashRouter,
    RouterProvider
} from "react-router-dom";
import { useSingleState } from "react-obstate";
import { Navigator } from "./navigation/Navigator.js";
import { APP_STATE } from "../state/app.js";
import { ThemeProvider } from "../../shared/components/ThemeProvider.js";
import { PopupPage } from "../types.js";

const ROUTER = createHashRouter([
    {
        path: "/",
        element: <FullApp />
    },
    {
        path: "/dialog",
        element: <InPageApp />
    }
]);

export function App() {
    return (
        <ThemeProvider darkMode={false}>
            <RouterProvider router={ROUTER} />
        </ThemeProvider>
    );
}

function FullApp() {
    const [tab, setTab] = useSingleState(APP_STATE, "tab");
    return (
        <Navigator
            activeTab={tab}
            onChangeTab={setTab}
            tabs={[
                PopupPage.Entries,
                PopupPage.Vaults,
                PopupPage.OTPs,
                PopupPage.Settings
            ]}
        />
    );
}

function InPageApp() {
    const [tab, setTab] = useSingleState(APP_STATE, "tab");
    return (
        <Navigator
            activeTab={tab}
            onChangeTab={setTab}
            tabs={[
                PopupPage.Entries
            ]}
        />
    );
}
