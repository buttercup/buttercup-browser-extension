import React, { Ref, useCallback, useEffect, useMemo, useRef } from "react";
import { Callout, Colors, FileInput, Intent, Spinner, Tree, TreeNodeInfo } from "@blueprintjs/core";
import { FileIdentifier, FileItem, FileSystemInterface, PathIdentifier } from "@buttercup/file-interface";
import { createStateObject } from "obstate";
import { useSingleState } from "react-obstate";
import { VaultType } from "../../types.js";
import { useAsync } from "../../../shared/hooks/async.js";
import { getNewTreeItem } from "./newTreeItem.js";

type DirectoryContents = Record<string, Array<FileItem> | null>;

interface RemoteExplorerFetchResult {
    directory: string | number;
    contents: Array<FileItem>;
}

interface RemoteExplorerProps {
    fsInterface: FileSystemInterface;
    type: VaultType;
}

interface RemoteExplorerState {
    // directory: PathIdentifier | FileItem;
    directoryContents: DirectoryContents;
    fsInterface: FileSystemInterface | null;
    newFileDirectory: string | number | null;
    newFileName: string | null;
    openDirectories: Array<string | number>;
    root: FileItem;
    selectedFile: FileIdentifier | null;
}

type TreeTarget = FileItem;

const BCUP_EXTENSION = /\.bcup$/i;

async function fetchDirectoryContents(
    target: FileIdentifier,
    type: VaultType,
    fsInterface: FileSystemInterface
): Promise<RemoteExplorerFetchResult> {
    switch (type) {
        case VaultType.Dropbox: {
            const contents = await fsInterface.getDirectoryContents(target);
            return {
                directory: target.identifier,
                contents
            };
        }
        default:
            throw new Error(`Unknown remote type: ${type}`);
    }
}

function getTree(
    target: TreeTarget,
    directoryContents: DirectoryContents,
    openDirectories: Array<string | number>,
    newFileName: string | null,
    newFileDirectory: string | number | null,
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
): Promise<RemoteExplorerFetchResult> {
    return fetchDirectoryContents({ identifier: "/", name: "/" }, type, fsInterface);
}

function prepareState(type: VaultType, fsInterface: FileSystemInterface) {
    return createStateObject<RemoteExplorerState>({
        directoryContents: {},
        fsInterface,
        newFileDirectory: null,
        newFileName: null,
        openDirectories: ["/"],
        root: {
            identifier: "/",
            name: "/",
            type: "directory",
            size: 0
        },
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
    const [dirContents, setDirContents] = useSingleState(state, "directoryContents");
    const [openDirectories, setOpenDirectories] = useSingleState(state, "openDirectories");
    const [selectedItem, setSelectedItem] = useSingleState(state, "selectedFile");
    const [newFileName, setNewFileName] = useSingleState(state, "newFileName");
    const [newFileDirectory, setNewFileDirectory] = useSingleState(state, "newFileDirectory");
    const newFileInputRef = useRef<HTMLInputElement>(null);
    // Init
    const initialiseRemoteExplorer_ = useMemo(() => () => initialiseRemoteExplorer(props.type, fsInterface), [fsInterface]);
    const { value: initRes, error: initErr } = useAsync<RemoteExplorerFetchResult>(
        initialiseRemoteExplorer_,
        [fsInterface]
    );
    useEffect(() => {
        if (!initRes) return;
        setDirContents({
            [root.identifier]: sortItems(initRes.contents)
        });
    }, [initRes, root]);
    // Handlers
    const handleNodeCollapse = useCallback(({ nodeData }, _, e) => {
        setOpenDirectories(openDirectories.filter(dir => dir !== nodeData.identifier));
    }, [openDirectories]);
    const handleNodeExpand = useCallback(({ nodeData }, _, e) => {
        if (nodeData.type !== "directory") {
            e.preventDefault();
            return;
        }
        setOpenDirectories([
            ...openDirectories,
            nodeData.identifier
        ]);
        if (dirContents[nodeData.identifier] === null || dirContents[nodeData.identifier]) {
            return;
        }
        setDirContents({
            ...dirContents,
            [nodeData.identifier]: null
        });
        fetchDirectoryContents(
            { name: nodeData.name, identifier: nodeData.identifier },
            props.type,
            fsInterface
        )
            .then(res => {
                setDirContents({
                    ...dirContents,
                    [res.directory]: res.contents
                });
            })
            .catch(err => {
                console.error(err);
                // @todo show error
            });
    }, [dirContents, fsInterface, openDirectories]);
    const handleNodeToggle = useCallback((nodeInfo, nodePath, e) => {
        const isExpanded = openDirectories.includes(nodeInfo.nodeData.identifier);
        if (isExpanded) {
            handleNodeCollapse(nodeInfo, nodePath, e);
        } else {
            handleNodeExpand(nodeInfo, nodePath, e);
        }
    }, [handleNodeCollapse, handleNodeExpand, openDirectories]);
    const handleNodeClick = useCallback((nodeInfo, nodePath, e) => {
        const nodeData = nodeInfo.nodeData as TreeTarget & { new?: boolean; };
        if (nodeInfo?.nodeData && nodeData.type === "directory") {
            // handle directories
            handleNodeToggle(nodeInfo, nodePath, e);
            return;
        }
        if (nodeData.new) {
            // New file: init
            setNewFileName("");
            setNewFileDirectory(nodeData.parent.identifier);
        } else {
            setNewFileName(null);
            setNewFileDirectory(null);
            setSelectedItem({
                name: nodeInfo.nodeData.name,
                identifier: nodeInfo.nodeData.path
            });
        }
    }, [handleNodeToggle]);
    // Render
    const rootLoading = typeof dirContents[root.identifier] === "undefined" || dirContents[root.identifier] === null;
    if (rootLoading) {
        return (
            <Spinner size={32} />
        );
    } else if (initErr) {
        return (
            <Callout
                intent={Intent.DANGER}
                title="Initialisation Error"
            >
                {initErr.message}
            </Callout>
        );
    }
    console.log("STATE!", { newFileDirectory, newFileName });
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
                onNodeClick={handleNodeClick}
                onNodeCollapse={handleNodeCollapse}
                onNodeDoubleClick={handleNodeToggle}
                onNodeExpand={handleNodeExpand}
            />
        </div>
    );
}
