import React from "react";
import {
    createHashRouter,
    RouterProvider
} from "react-router-dom";
import { AddVaultPage } from "./pages/addVault/index.js";
import { AttributionsPage } from "./pages/AttributionsPage.js";

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
        <RouterProvider router={ROUTER} />
    );
}
