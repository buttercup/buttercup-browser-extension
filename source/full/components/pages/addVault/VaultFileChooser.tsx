import React, { useMemo } from "react";
import { FileSystemInterface } from "@buttercup/file-interface";
import { RemoteExplorer } from "../../explorer/RemoteExplorer.jsx";
import { createDropboxInterface } from "../../../services/remoteExplorer.js";
import { VaultType } from "../../../types.js";

interface VaultFileChooserProps {
    dropboxToken?: string;
    type: VaultType;
}

function routeRemoteExplorer(props: VaultFileChooserProps): FileSystemInterface {
    switch (props.type) {
        case VaultType.Dropbox:
            return createDropboxInterface(props.dropboxToken);
        default:
            throw new Error(`Unknown remote type: ${props.type}`);
    }
}

export function VaultFileChooser(props: VaultFileChooserProps) {
    const fsInterface = useMemo(() => routeRemoteExplorer(props), []);
    return (
        <RemoteExplorer fsInterface={fsInterface} type={props.type} />
    );
}
