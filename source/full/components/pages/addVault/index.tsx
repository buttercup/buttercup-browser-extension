import React from "react";
import { AddVaultPage as InternalPage } from "./AddVaultPage.jsx";
import { ErrorBoundary } from "../../../../shared/components/ErrorBoundary.jsx";

export function AddVaultPage() {
    return (
        <ErrorBoundary>
            <InternalPage />
        </ErrorBoundary>
    );
}
