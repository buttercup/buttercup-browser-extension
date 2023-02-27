import React from "react";
import {
    createHashRouter,
    RouterProvider
} from "react-router-dom";
import { ThemeProvider } from "../../shared/components/ThemeProvider.jsx";
import { ConnectPage } from "./pages/connect/index.jsx";
import { AttributionsPage } from "./pages/AttributionsPage.jsx";

const ROUTER = createHashRouter([
    {
        path: "/connect",
        element: <ConnectPage />
    },
    {
        path: "/attributions",
        element: <AttributionsPage />
    }
]);

export function App() {
    return (
        <ThemeProvider darkMode={false}>
            <RouterProvider router={ROUTER} />
        </ThemeProvider>
    );
}
