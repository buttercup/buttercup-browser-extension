import React from "react";
import {
    createHashRouter,
    RouterProvider,
    Route,
} from "react-router-dom";

const ROUTER = createHashRouter([
    {
      path: "/",
      element: <div>Test 2</div>,
    },
]);

export function App() {
    return (
        <RouterProvider router={ROUTER} />
    );
}
