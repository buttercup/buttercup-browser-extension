import React, { Fragment, useCallback, useMemo, useState } from "react";
import { NonIdealState, Tree, TreeNodeInfo } from "@blueprintjs/core";
import { EntryPropertyType, VaultFacade, VaultSourceID, fieldsToProperties } from "buttercup";
import { SiteIcon } from "@buttercup/ui";
import styled from "styled-components";
import { t } from "../../../../shared/i18n/trans.js";
import { useAllVaultsContents } from "../../../hooks/vaultContents.js";
import { BusyLoader } from "../../../../shared/components/loading/BusyLoader.js";
import { ErrorMessage } from "../../../../shared/components/ErrorMessage.js";
import { NewEntrySavePrompt } from "./NewEntrySavePrompt.js";
import { useCapturedCredentials } from "../../../hooks/credentials.js";
import { extractEntryDomain } from "../../../../shared/library/domain.js";
import { SavedCredentials, UsedCredentials, VaultsTree } from "../../../types.js";

interface CredentialsSaverProps {
    mode: "existing" | "new";
    onSaveNewClick: (credentials: SavedCredentials) => void;
    saving: boolean;
    selected: string;
}

interface NodeInfo {
    id: string;
    type: "group" | "entry";
}

const EntryTreeIcon = styled(SiteIcon)`
    width: 18px;
    height: 18px;
    margin-right: 5px;

    > img {
        width: 100%;
        height: 100%;
    }
`;

function buildGroupNodes(
    sourceID: VaultSourceID,
    vault: VaultFacade,
    parentGroupID: string | null,
    expanded: Array<string>,
    selected: Array<string>,
    mode: "existing" | "new"
): Array<TreeNodeInfo<NodeInfo>> {
    const output = vault.groups.reduce((output: Array<TreeNodeInfo<NodeInfo>>, group) => {
        const groupParent = group.parentID === "0" ? null : group.parentID;
        if (groupParent !== parentGroupID) return output;
        const id = `group:${sourceID}:${group.id}`;
        const newNode: TreeNodeInfo<NodeInfo> = {
            childNodes: buildGroupNodes(sourceID, vault, group.id, expanded, selected, mode),
            hasCaret: countGroupChildren(vault, group.id, mode === "existing") > 0,
            icon: expanded.includes(id) ? "folder-open" : "folder-close",
            id,
            isExpanded: expanded.includes(id),
            isSelected: selected.includes(id),
            label: group.title,
            nodeData: {
                id,
                type: "group"
            }
        };
        return [
            ...output,
            newNode
        ];
    }, []);
    if (mode === "existing") {
        // Add entries
        output.push(...vault.entries.reduce((output: Array<TreeNodeInfo<NodeInfo>>, entry) => {
            if (entry.parentID !== parentGroupID) return output;
            const id = `entry:${sourceID}:${parentGroupID}:${entry.id}`;
            const titleField = entry.fields.find(field => field.propertyType === EntryPropertyType.Property && field.property === "title");
            const title = titleField?.value ?? "(Untitled)";
            const domain = extractEntryDomain(fieldsToProperties(entry.fields));
            const newNode: TreeNodeInfo<NodeInfo> = {
                childNodes: [],
                hasCaret: false,
                icon: (
                    <EntryTreeIcon
                        domain={domain}
                        type={entry.type}
                    />
                ),
                id,
                isExpanded: false,
                isSelected: selected.includes(id),
                label: title,
                nodeData: {
                    id,
                    type: "entry"
                }
            };
            return [
                ...output,
                newNode
            ];
        }, []))
    }
    return output;
}

function buildVaultRootNodes(
    vaultTree: VaultsTree,
    expanded: Array<string>,
    selected: Array<string>,
    mode: "existing" | "new"
): Array<TreeNodeInfo<NodeInfo>> {
    return Object.keys(vaultTree).map(sourceID => ({
        childNodes: buildGroupNodes(sourceID, vaultTree[sourceID], null, expanded, selected, mode),
        icon: "box",
        id: `source:${sourceID}`,
        isExpanded: expanded.includes(`source:${sourceID}`),
        label: sourceID,
        nodeData: {
            id: `source:${sourceID}`,
            type: "group"
        }
    }));
}

function countGroupChildren(
    vault: VaultFacade,
    parentGroupID: string | null,
    includeEntries: boolean
): number {
    let total = vault.groups.reduce((output: number, group) => {
        const groupParent = group.parentID === "0" ? null : group.parentID;
        return groupParent === parentGroupID ? output + 1 : output;
    }, 0);
    if (includeEntries) {
        total += vault.entries.reduce((output: number, entry) => {
            return entry.parentID === parentGroupID ? output + 1 : output;
        }, 0);
    }
    return total;
}

export function CredentialsSaver(props: CredentialsSaverProps) {
    const { mode, onSaveNewClick, saving, selected: selectedCredentialsID } = props;
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
    const selectedEntryURI = useMemo(() => {
        return selectedNodes.length === 1 && /^entry:/.test(selectedNodes[0])
            ? selectedNodes[0]
            : null;
    }, [selectedNodes]);
    const contents = useMemo(
        () => tree ? buildVaultRootNodes(tree, expandedNodes, selectedNodes, mode) : [],
        [expandedNodes, mode, selectedNodes, tree]
    );
    const handleNodeClick = useCallback((node: TreeNodeInfo<NodeInfo>) => {
        if (saving) return;
        if (mode === "existing") {
            if (node.nodeData?.type === "entry") {
                // Only select entries
                setSelectedNodes([node.nodeData.id]);
            }
        } else if (mode === "new") {
            // Groups only, select immediately
            setSelectedNodes([node.nodeData.id]);
        }
    }, [mode, saving]);
    const handleSaveClick = useCallback((credentials: UsedCredentials) => {
        if (mode === "new") {
            const [, sourceID, groupID] = selectedGroupURI.split(":");
            onSaveNewClick({
                ...credentials,
                groupID,
                sourceID
            });
        } else if (mode === "existing") {
            const [, sourceID, groupID, entryID] = selectedEntryURI.split(":");
            onSaveNewClick({
                ...credentials,
                groupID,
                sourceID,
                entryID
            });
        }
    }, [mode, onSaveNewClick, selectedEntryURI, selectedGroupURI]);
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
                    {mode === "new" && contents.length > 0 && selectedGroupURI && (
                        <NewEntrySavePrompt
                            credentials={selectedUsedCredentials}
                            onSaveClick={handleSaveClick}
                            saving={saving}
                        />
                    )}
                    {mode === "existing" && contents.length > 0 && selectedEntryURI && (
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
