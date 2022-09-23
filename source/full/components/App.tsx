import React from "react";
import {
    createHashRouter,
    RouterProvider
} from "react-router-dom";
import { AddVault } from "./pages/AddVault.js";

const ROUTER = createHashRouter([
    {
        path: "/add-vault",
        element: <AddVault />
    }
]);

export function App() {
    return (
        <RouterProvider router={ROUTER} />
    );
}
