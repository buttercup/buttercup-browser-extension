import React, { useCallback, useMemo } from "react";
import { FileIdentifier, FileSystemInterface } from "@buttercup/file-interface";
import { RemoteExplorer } from "../../explorer/RemoteExplorer.jsx";
import { createDropboxInterface } from "../../../services/remoteExplorer.js";
import { VaultType } from "../../../types.js";

interface VaultFileChooserProps {
    dropboxToken?: string;
    onSelectVault: (filename: string, isNew: boolean) => void;
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
    const { onSelectVault } = props;
    const fsInterface = useMemo(() => routeRemoteExplorer(props), []);
    const handleNewFileSelected = useCallback((file: FileIdentifier, isNew: boolean) => {
        onSelectVault(file.identifier as string, isNew);
    }, [onSelectVault]);
    return (
        <RemoteExplorer
            fsInterface={fsInterface}
            onSelectedVault={handleNewFileSelected}
            type={props.type}
        />
    );
}
