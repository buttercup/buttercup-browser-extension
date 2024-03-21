import React from "react";
import { ConnectPage as InternalPage } from "./ConnectPage.js";
import { ErrorBoundary } from "../../../../shared/components/ErrorBoundary.jsx";

export function ConnectPage() {
    return (
        <ErrorBoundary>
            <InternalPage />
        </ErrorBoundary>
    );
}
