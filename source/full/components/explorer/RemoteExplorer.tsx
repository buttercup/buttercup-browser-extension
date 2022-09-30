import React from "react";
import { Colors, Spinner, Tree } from "@blueprintjs/core";
import { FileItem } from "@buttercup/file-interface";
import { RemoteExplorer as RemoteExplorerSvc } from "../../services/RemoteExplorer.js";

interface RemoteExplorerProps {
    // directoryContents: Record<string, Array<FileItem> | null>;
    // onOpenDirectory: (directory: string) => void;
    // rootDirectory: string;
    explorer: RemoteExplorerSvc;
}

const BCUP_EXTENSION = /\.bcup$/i;

export function RemoteExplorer(props: RemoteExplorerProps) {
    return (
        <div></div>
    );
}
