import React from "react";
import {
    createHashRouter,
    RouterProvider,
    Route,
} from "react-router-dom";
// import { SearchPage } from "./pages/AddVaultPage.jsx";

const ROUTER = createHashRouter([
    {
        path: "/add-vault",
        element: <div>Test</div>
    }
]);

export function App() {
    return (
        <RouterProvider router={ROUTER} />
    );
}
