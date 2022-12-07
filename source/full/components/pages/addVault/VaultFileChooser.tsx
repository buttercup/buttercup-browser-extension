import React, { useCallback, useMemo } from "react";
import { Button, Card, H5, Icon, Intent } from "@blueprintjs/core";
import styled from "styled-components";
import { FileIdentifier, FileSystemInterface } from "@buttercup/file-interface";
import { RemoteExplorer } from "../../explorer/RemoteExplorer.jsx";
import { createDropboxInterface } from "../../../services/remoteExplorer.js";
import { VaultType } from "../../../types.js";
import { t } from "../../../../shared/i18n/trans.js";

interface VaultFileChooserProps {
    confirmSelectedNew: boolean;
    confirmSelectedVault: string | null;
    dropboxToken?: string;
    onConfirmSelection: () => void;
    onSelectVault: (filename: string, isNew: boolean) => void;
    type: VaultType;
}

const SelectedFilePre = styled.pre`
    margin: 0;
`;
const VaultChoiceCard = styled(Card)`
    margin: 16px 0px;
`;
const VaultChoiceCardContents = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;
const VaultChoiceCardHeading = styled(H5)`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const VaultChoiceCardHeadingIcon = styled(Icon)`
    margin-right: 8px;
`;

function routeRemoteExplorer(props: VaultFileChooserProps): FileSystemInterface {
    switch (props.type) {
        case VaultType.Dropbox:
            return createDropboxInterface(props.dropboxToken);
        default:
            throw new Error(`Unknown remote type: ${props.type}`);
    }
}

export function VaultFileChooser(props: VaultFileChooserProps) {
    const {
        confirmSelectedNew,
        confirmSelectedVault,
        onConfirmSelection,
        onSelectVault
    } = props;
    const fsInterface = useMemo(() => routeRemoteExplorer(props), []);
    const handleNewFileSelected = useCallback((file: FileIdentifier, isNew: boolean) => {
        onSelectVault(file.identifier as string, isNew);
    }, [onSelectVault]);
    return (
        <>
            <VaultChoiceCard>
                <VaultChoiceCardHeading>
                    <VaultChoiceCardHeadingIcon icon="property" />
                    {t("add-vault-page.section-select.choice-heading")}
                </VaultChoiceCardHeading>
                <VaultChoiceCardContents>
                    <div>
                        <strong>{t("add-vault-page.section-select.choice-vault-filename")}</strong>
                        <br />
                        {confirmSelectedVault === null && (
                            <i>None</i>
                        ) || (
                            <SelectedFilePre>{confirmSelectedVault}</SelectedFilePre>
                        )}
                    </div>
                    <div>
                        <strong>{t("add-vault-page.section-select.choice-vault-new")}</strong>
                        <br />
                        <span>{confirmSelectedNew ? t("add-vault-page.section-select.new-yes") : t("add-vault-page.section-select.new-no")}</span>
                    </div>
                    <Button
                        disabled={!confirmSelectedVault}
                        icon="confirm"
                        intent={Intent.PRIMARY}
                        onClick={() => onConfirmSelection()}
                        text={t("add-vault-page.section-select.choice-continue")}
                    />
                </VaultChoiceCardContents>
            </VaultChoiceCard>
            <RemoteExplorer
                fsInterface={fsInterface}
                onSelectedVault={handleNewFileSelected}
                type={props.type}
            />
        </>
    );
}
