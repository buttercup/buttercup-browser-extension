import React from "react";
import {
    createHashRouter,
    RouterProvider
} from "react-router-dom";
import { ThemeProvider } from "../../shared/components/ThemeProvider.jsx";
import { ConnectPage } from "./pages/connect/index.jsx";
import { AttributionsPage } from "./pages/AttributionsPage.jsx";
import { SaveCredentialsPage } from "./pages/saveCredentials/index.js";
import { useBodyThemeClass, useTheme } from "../../shared/hooks/theme.js";
import { RouteError } from "../../shared/components/RouteError.js";
import { DisabledDomainsPage } from "./pages/DisabledDomainsPage.js";
import { NotificationsPage } from "./pages/NotificationsPage.js";

const ROUTER = createHashRouter([
    {
        path: "/connect",
        element: <ConnectPage />,
        errorElement: <RouteError />
    },
    {
        path: "/attributions",
        element: <AttributionsPage />,
        errorElement: <RouteError />
    },
    {
        path: "/disabled-domains",
        element: <DisabledDomainsPage />,
        errorElement: <RouteError />
    },
    {
        path: "/notifications",
        element: <NotificationsPage />,
        errorElement: <RouteError />,
        loader: ({ request }) => {
            const url = new URL(request.url);
            const notifications = url.searchParams.get("notifications");
            return { notifications };
        }
    },
    {
        path: "/save-credentials",
        element: <SaveCredentialsPage />,
        errorElement: <RouteError />
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
