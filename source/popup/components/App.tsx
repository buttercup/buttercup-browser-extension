import React from "react";
import {
    createHashRouter,
    RouterProvider,
    Route,
} from "react-router-dom";
import { SearchPage } from "./pages/SearchPage.jsx";

const ROUTER = createHashRouter([
    {
        path: "/",
        element: <SearchPage />
    }
]);

export function App() {
    return (
        <RouterProvider router={ROUTER} />
    );
}
