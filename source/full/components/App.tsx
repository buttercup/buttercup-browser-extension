import React from "react";
import {
    createHashRouter,
    RouterProvider
} from "react-router-dom";
import { ThemeProvider } from "../../shared/components/ThemeProvider.js";
import { AddVaultPage } from "./pages/addVault/index.jsx";
import { AttributionsPage } from "./pages/AttributionsPage.jsx";

const ROUTER = createHashRouter([
    {
        path: "/add-vault",
        element: <AddVaultPage />
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
