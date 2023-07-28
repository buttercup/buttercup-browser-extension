import React, { Fragment, useCallback, useMemo, useState } from "react";
import { Tree, TreeNodeInfo } from "@blueprintjs/core";
import { VaultFacade } from "buttercup";
import { t } from "../../../../shared/i18n/trans.js";
import { useAllVaultsContents } from "../../../hooks/vaultContents.js";
import { BusyLoader } from "../../../../shared/components/loading/BusyLoader.js";
import { ErrorMessage } from "../../../../shared/components/ErrorMessage.js";
import { VaultsTree } from "../../../types.js";
import { NewEntrySavePrompt } from "./NewEntrySavePrompt.js";
import { useCapturedCredentials } from "../../../hooks/credentials.js";

interface CredentialsSaverProps {
    selected: string;
}

interface NodeInfo {
    id: string;
}

function buildGroupNodes(
    vault: VaultFacade,
    parentGroupID: string | null,
    expanded: Array<string>,
    selected: Array<string>
): Array<TreeNodeInfo<NodeInfo>> {
    return vault.groups.reduce((output: Array<TreeNodeInfo<NodeInfo>>, group) => {
        const groupParent = group.parentID === "0" ? null : group.parentID;
        if (groupParent !== parentGroupID) return output;
        const id = `group:${vault.id}:${group.id}`;
        return [
            ...output,
            {
                childNodes: buildGroupNodes(vault, group.id, expanded, selected),
                hasCaret: countGroupChildren(vault, group.id) > 0,
                icon: expanded.includes(id) ? "folder-open" : "folder-close",
                id,
                isExpanded: expanded.includes(id),
                isSelected: selected.includes(id),
                label: group.title,
                nodeData: {
                    id
                }
            }
        ];
    }, []);
}

function buildVaultRootNodes(
    vaultTree: VaultsTree,
    expanded: Array<string>,
    selected: Array<string>
): Array<TreeNodeInfo<NodeInfo>> {
    return Object.keys(vaultTree).map(sourceID => ({
        childNodes: buildGroupNodes(vaultTree[sourceID], null, expanded, selected),
        icon: "box",
        id: `source:${sourceID}`,
        isExpanded: expanded.includes(`source:${sourceID}`),
        label: sourceID,
        nodeData: {
            id: `source:${sourceID}`
        }
    }));
}

function countGroupChildren(
    vault: VaultFacade,
    parentGroupID: string | null
): number {
    return vault.groups.reduce((output: number, group) => {
        const groupParent = group.parentID === "0" ? null : group.parentID;
        return groupParent === parentGroupID ? output + 1 : output;
    }, 0);
}

export function CredentialsSaver(props: CredentialsSaverProps) {
    const { selected: selectedCredentialsID } = props;
    const {
        error: contentsError,
        loading: contentsLoading,
        tree
    } = useAllVaultsContents();
    const [credentials, credentialsLoading, credentialsError] = useCapturedCredentials();
    const [selectedNodes, setSelectedNodes] = useState<Array<string>>([]);
    const [expandedNodes, setExpandedNodes] = useState<Array<string>>([]);
    const selectedUsedCredentials = useMemo(() => credentials.find(cred => cred.id === selectedCredentialsID), [credentials, selectedCredentialsID]);
    const selectedGroupURI = useMemo(() => {
        return selectedNodes.length === 1 && /^group:/.test(selectedNodes[0])
            ? selectedNodes[0]
            : null;
    }, [selectedNodes]);
    const contents = useMemo(
        () => tree ? buildVaultRootNodes(tree, expandedNodes, selectedNodes) : [],
        [expandedNodes, selectedNodes, tree]
    );
    const handleNodeClick = useCallback((node: TreeNodeInfo<NodeInfo>) => {
        setSelectedNodes([node.nodeData.id]);
    }, []);
    return (
        <div>
            {contentsError && (
                <ErrorMessage message={contentsError.message} scroll={false} />
            )}
            {credentialsError && (
                <ErrorMessage message={credentialsError.message} scroll={false} />
            )}
            {(contentsLoading || credentialsLoading) && (
                <BusyLoader
                    title={t("save-credentials-page.credentials-saver.create-new.loader.title")}
                    description={t("save-credentials-page.credentials-saver.create-new.loader.description")}
                />
            )}
            {tree && (
                <Fragment>
                    <Tree
                        contents={contents}
                        onNodeClick={handleNodeClick}
                        onNodeCollapse={node => setExpandedNodes(
                            current => current.filter(id => id !== node.nodeData.id)
                        )}
                        onNodeExpand={node => setExpandedNodes(current => [
                            ...current,
                            node.nodeData.id
                        ])}
                    />
                    {selectedGroupURI && (
                        <NewEntrySavePrompt credentials={selectedUsedCredentials} />
                    )}
                </Fragment>
            )}
        </div>
    );
}
