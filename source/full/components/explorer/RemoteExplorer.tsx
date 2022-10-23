import React, { Ref, useEffect, useMemo, useRef } from "react";
import { Colors, FileInput, Spinner, Tree, TreeNodeInfo } from "@blueprintjs/core";
import { FileIdentifier, FileItem, FileSystemInterface, PathIdentifier } from "@buttercup/file-interface";
import { createStateObject } from "obstate";
import { useSingleState } from "react-obstate";
import { VaultType } from "../../types.js";
import { useAsync } from "../../../shared/hooks/async.js";
import { getNewTreeItem } from "./newTreeItem.js";

type DirectoryContents = Record<string, Array<FileItem> | null>;

interface RemoteExplorerInitResult {
    directory: string;
    contents: Array<FileItem>;
}

interface RemoteExplorerProps {
    fsInterface: FileSystemInterface;
    type: VaultType;
}

interface RemoteExplorerState {
    directory: PathIdentifier | FileItem;
    directoryContents: DirectoryContents;
    fsInterface: FileSystemInterface | null;
    newFileDirectory: string | null;
    newFileName: string | null;
    openDirectories: Array<string | number>;
    root: PathIdentifier;
    selectedFile: FileItem | null;
}

const BCUP_EXTENSION = /\.bcup$/i;

function getTree(
    target: PathIdentifier | FileItem,
    directoryContents: DirectoryContents,
    openDirectories: Array<string | number>,
    newFileName: string | null,
    newFileDirectory: string | null,
    selectedItem: FileIdentifier | null,
    newFileInputRef: Ref<HTMLInputElement>
): TreeNodeInfo {
    const isDir = !(target as FileItem).type || (target as FileItem).type === "directory";
    const childItems = isDir && directoryContents[target.identifier] || [];
    return {
        id: target.identifier,
        label: target.name,
        isExpanded: openDirectories.includes(target.identifier),
        isSelected: false,
        hasCaret: isDir,
        icon: isDir ? "folder-close" : "document",
        nodeData: target,
        disabled: !isDir && !BCUP_EXTENSION.test(target.name),
        childNodes: directoryContents[target.identifier] === null
            ? [
                {
                    id: "loading" + Math.random().toString(),
                    label: "Loading",
                    icon: <Spinner size={16} />
                }
            ]
            : [
                ...childItems.reduce((output, item) =>
                    item.type === "directory"
                        ? [...output, getTree(
                            item,
                            directoryContents,
                            openDirectories,
                            newFileName,
                            newFileDirectory,
                            selectedItem,
                            newFileInputRef
                        )]
                        : output,
                    []
                ),
                ...childItems.reduce((output, item) =>
                    item.type === "file"
                        ? [...output, getTree(
                            item,
                            directoryContents,
                            openDirectories,
                            newFileName,
                            newFileDirectory,
                            selectedItem,
                            newFileInputRef
                        )]
                        : output,
                    []
                ),
                getNewTreeItem(
                    target,
                    newFileName,
                    newFileDirectory,
                    selectedItem,
                    (event: React.MouseEvent<HTMLInputElement>, parentPath: PathIdentifier | FileIdentifier) => {},
                    (event: React.ChangeEvent<HTMLInputElement>) => {},
                    (event: React.FocusEvent<HTMLInputElement>) => {},
                    (event: React.KeyboardEvent<HTMLInputElement>) => {},
                    newFileInputRef
                )
            ]
    };
}

async function initialiseRemoteExplorer(
    type: VaultType,
    fsInterface: FileSystemInterface
): Promise<RemoteExplorerInitResult> {
    switch (type) {
        case VaultType.Dropbox: {
            const contents = await fsInterface.getDirectoryContents({ identifier: "/", name: "/" });
            return {
                directory: "/",
                contents
            };
        }
        default:
            throw new Error(`Unknown remote type: ${type}`);
    }
}

function prepareState(type: VaultType, fsInterface: FileSystemInterface) {
    return createStateObject<RemoteExplorerState>({
        directory: { identifier: "/", name: "/" },
        directoryContents: {},
        fsInterface,
        newFileDirectory: null,
        newFileName: null,
        openDirectories: ["/"],
        root: { identifier: "/", name: "/" },
        selectedFile: null
    });
}

function sortItems(items: Array<FileItem>): Array<FileItem> {
    return items.sort((a: FileItem, b: FileItem): number => {
        if (a.type === "directory" && b.type === "file") return -1;
        if (b.type === "directory" && a.type === "file") return 1;
        if (a.name === b.name) return 0;
        return a.name > b.name ? 1 : -1;
    });
}

export function RemoteExplorer(props: RemoteExplorerProps) {
    const state = useMemo(() => prepareState(props.type, props.fsInterface), [props.fsInterface]);
    const [fsInterface] = useSingleState(state, "fsInterface");
    const [root] = useSingleState(state, "root");
    const [directory, setDirectory] = useSingleState(state, "directory");
    const [dirContents, setDirContents] = useSingleState(state, "directoryContents");
    const [openDirectories, setOpenDirectories] = useSingleState(state, "openDirectories");
    const [selectedItem, setSelectedItem] = useSingleState(state, "selectedFile");
    const [newFileName, setNewFileName] = useSingleState(state, "newFileName");
    const [newFileDirectory, setNewFileDirectory] = useSingleState(state, "newFileDirectory");
    const newFileInputRef = useRef<HTMLInputElement>(null);
    // Init
    const initialiseRemoteExplorer_ = useMemo(() => () => initialiseRemoteExplorer(props.type, fsInterface), [fsInterface]);
    const { value: initRes, error: initErr } = useAsync<RemoteExplorerInitResult>(
        initialiseRemoteExplorer_,
        [fsInterface]
    );
    useEffect(() => {
        if (!initRes) return;
        setDirContents({
            [root.identifier]: sortItems(initRes.contents)
        });
        setDirectory({
            identifier: initRes.directory,
            name: initRes.directory
        });

    }, [initRes, root]);
    // Render
    const rootLoading = typeof dirContents[root.identifier] === "undefined" || dirContents[root.identifier] === null;
    if (rootLoading) {
        return (
            <Spinner size={32} />
        );
    }
    return (
        <div>
            <Tree
                contents={getTree(
                    root,
                    dirContents,
                    openDirectories,
                    newFileName,
                    newFileDirectory,
                    selectedItem,
                    newFileInputRef
                ).childNodes}
                onNodeClick={() => {}}
                onNodeCollapse={() => {}}
                onNodeDoubleClick={() => {}}
                onNodeExpand={() => {}}
                // contents={this.getTree(this.props.rootDirectory).childNodes}
                // onNodeExpand={::this.handleNodeExpand}
                // onNodeCollapse={::this.handleNodeCollapse}
                // onNodeDoubleClick={::this.handleNodeToggle}
                // onNodeClick={::this.handleNodeClick}
            />
        </div>
    );
}
