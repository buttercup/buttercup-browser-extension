import React, { useEffect, useState } from "react";
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
import { useBodyThemeClass, useTheme } from "../../shared/hooks/theme.js";
import { SaveDialogPage } from "./pages/SaveDialogPage.js";
import { useCurrentTabURL } from "../hooks/tab.js";
import { PopupPage } from "../types.js";

const ROUTER = createHashRouter([
    {
        path: "/",
        element: <ToolbarApp />
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
    },
    {
        path: "/save-dialog",
        element: <SavePromptApp />,
        loader: ({ request }) => {
            const url = new URL(request.url);
            const loginID = url.searchParams.get("login");
            return { loginID };
        }
    }
]);

export function App() {
    const theme = useTheme();
    useBodyThemeClass(theme);
    return (
        <ThemeProvider darkMode={theme === "dark"}>
            <RouterProvider router={ROUTER} />
        </ThemeProvider>
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

function SavePromptApp() {
    const { loginID = null } = useLoaderData() as {
        loginID: string;
    };
    useBodyClass("in-page");
    return (
        <LaunchContextProvider source="page" loginID={loginID}>
            <SaveDialogPage />
        </LaunchContextProvider>
    );
}

function ToolbarApp() {
    const [tab, setTab] = useSingleState(APP_STATE, "tab");
    const [loadingURL, url] = useCurrentTabURL();
    const [hasLoadedURL, setHasLoadedURL] = useState<boolean>(false);
    useEffect(() => {
        if (!loadingURL) {
            setHasLoadedURL(true);
        }
    }, [loadingURL]);
    if (!hasLoadedURL) return null;
    return (
        <LaunchContextProvider source="popup" url={url}>
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
