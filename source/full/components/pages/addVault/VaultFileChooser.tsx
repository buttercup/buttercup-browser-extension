import React, { useMemo } from "react";
import { RemoteExplorer } from "../../explorer/RemoteExplorer.jsx";
import {
    RemoteExplorer as RemoteExplorerSvc,
    initialiseDropboxExplorer
} from "../../../services/RemoteExplorer.js";

interface VaultFileChooserProps {
    dropboxToken?: string;
    type: "dropbox";
}

function routeRemoteExplorer(props: VaultFileChooserProps): RemoteExplorerSvc {
    switch (props.type) {
        case "dropbox":
            return initialiseDropboxExplorer(props.dropboxToken);
        default:
            throw new Error(`Unknown remote type: ${props.type}`);
    }
}

export function VaultFileChooser(props: VaultFileChooserProps) {
    const remoteExplorer = useMemo(() => routeRemoteExplorer(props), []);
    return (
        <RemoteExplorer
            explorer={remoteExplorer}
        />
    );
}
