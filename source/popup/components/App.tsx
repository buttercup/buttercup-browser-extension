import React, { useEffect } from "react";
import {
    createHashRouter,
    RouterProvider,
    useLoaderData
} from "react-router-dom";
import { useSingleState } from "react-obstate";
import { Navigator } from "./navigation/Navigator.js";
import { APP_STATE } from "../state/app.js";
import { ThemeProvider } from "../../shared/components/ThemeProvider.js";
import { useBodyClass } from "../hooks/document.js";
import { LaunchContextProvider } from "./contexts/LaunchContext.js";
import { PopupPage } from "../types.js";

const ROUTER = createHashRouter([
    {
        path: "/",
        element: <FullApp />
    },
    {
        path: "/dialog",
        element: <InPageApp />,
        loader: ({ request }) => {
            const url = new URL(request.url);
            const pageURL = url.searchParams.get("page");
            const formID = url.searchParams.get("form");
            const initialTab = url.searchParams.get("initial");
            return { formID, url: pageURL, initialTab };
        }
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
        <LaunchContextProvider source="popup">
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
        </LaunchContextProvider>
    );
}

function InPageApp() {
    const [tab, setTab] = useSingleState(APP_STATE, "tab");
    useBodyClass("in-page");
    const { formID = "", initialTab, url = null } = useLoaderData() as {
        formID?: string;
        initialTab: PopupPage,
        url: string;
    };
    useEffect(() => {
        setTab(initialTab);
    }, [initialTab]);
    return (
        <LaunchContextProvider source="page" formID={formID || null} url={url}>
            <Navigator
                activeTab={tab}
                onChangeTab={setTab}
                tabs={[
                    PopupPage.Entries,
                    PopupPage.OTPs
                ]}
            />
        </LaunchContextProvider>
    );
}
