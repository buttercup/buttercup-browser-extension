import React, { Fragment, useCallback, useMemo, useState } from "react";
import { NonIdealState, Tree, TreeNodeInfo } from "@blueprintjs/core";
import { VaultFacade, VaultSourceID } from "buttercup";
import { t } from "../../../../shared/i18n/trans.js";
import { useAllVaultsContents } from "../../../hooks/vaultContents.js";
import { BusyLoader } from "../../../../shared/components/loading/BusyLoader.js";
import { ErrorMessage } from "../../../../shared/components/ErrorMessage.js";
import { NewEntrySavePrompt } from "./NewEntrySavePrompt.js";
import { useCapturedCredentials } from "../../../hooks/credentials.js";
import { SavedCredentials, UsedCredentials, VaultsTree } from "../../../types.js";

interface CredentialsSaverProps {
    onSaveNewClick: (credentials: SavedCredentials) => void;
    saving: boolean;
    selected: string;
}

interface NodeInfo {
    id: string;
}

function buildGroupNodes(
    sourceID: VaultSourceID,
    vault: VaultFacade,
    parentGroupID: string | null,
    expanded: Array<string>,
    selected: Array<string>
): Array<TreeNodeInfo<NodeInfo>> {
    return vault.groups.reduce((output: Array<TreeNodeInfo<NodeInfo>>, group) => {
        const groupParent = group.parentID === "0" ? null : group.parentID;
        if (groupParent !== parentGroupID) return output;
        const id = `group:${sourceID}:${group.id}`;
        return [
            ...output,
            {
                childNodes: buildGroupNodes(sourceID, vault, group.id, expanded, selected),
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
        childNodes: buildGroupNodes(sourceID, vaultTree[sourceID], null, expanded, selected),
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
    const { onSaveNewClick, saving, selected: selectedCredentialsID } = props;
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
        if (saving) return;
        setSelectedNodes([node.nodeData.id]);
    }, [saving]);
    const handleSaveClick = useCallback((credentials: UsedCredentials) => {
        const [, sourceID, groupID] = selectedGroupURI.split(":");
        onSaveNewClick({
            ...credentials,
            groupID,
            sourceID
        });
    }, [onSaveNewClick, selectedGroupURI]);
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
                    {contents.length > 0 && (
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
                    ) || (
                        <NonIdealState
                            icon="inbox"
                            title={t("save-credentials-page.credentials-saver.no-vaults.title")}
                            description={t("save-credentials-page.credentials-saver.no-vaults.description")}
                        />
                    )}
                    {contents.length > 0 && selectedGroupURI && (
                        <NewEntrySavePrompt
                            credentials={selectedUsedCredentials}
                            onSaveClick={handleSaveClick}
                            saving={saving}
                        />
                    )}
                </Fragment>
            )}
        </div>
    );
}
