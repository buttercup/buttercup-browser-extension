import React from "react";
import { useSingleState } from "react-obstate";
import { Navigator } from "./navigation/Navigator.js";
import { APP_STATE } from "../state/app.js";
import { ThemeProvider } from "../../shared/components/ThemeProvider.js";
// import {
//     createHashRouter,
//     RouterProvider
// } from "react-router-dom";
// import { SearchPage } from "./pages/SearchPage.jsx";

// const ROUTER = createHashRouter([
//     {
//         path: "/",
//         element: <SearchPage />
//     }
// ]);

export function App() {
    const [tab, setTab] = useSingleState(APP_STATE, "tab");
    return (
        <ThemeProvider darkMode={false}>
            <Navigator
                activeTab={tab}
                onChangeTab={setTab}
            />
        </ThemeProvider>
    );
    // return (
    //     <RouterProvider router={ROUTER} />
    // );
}
