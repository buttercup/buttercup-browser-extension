import React, { useCallback, useEffect, useRef, useState } from "react";
import { Callout, Colors, H4, H5, Intent } from "@blueprintjs/core";
import styled from "styled-components";
import { useSingleState } from "react-obstate";
import { Layout } from "../../Layout.js";
import { t } from "../../../../shared/i18n/trans.js";
import { useTitle } from "../../../hooks/document.js";
import { VaultTypeChooser } from "./VaultTypeChooser.js";
import { VaultFileChooser } from "./VaultFileChooser.js";
import { VaultConfirmation } from "./VaultConfirmation.js";
import { addVaultDatasource, processDropboxAuthentication } from "../../../services/datasource.js";
import { ADD_VAULT_STATE } from "../../../state/addVault.js";
import { VaultType } from "../../../types.js";

enum PageType {
    Confirm = "confirm",
    Choose = "choose",
    Select = "select"
}

const ErrorDescription = styled(Callout)`
    margin: 16px 0px;
`;
const ErrorHeading = styled(H5)`
    color: ${Colors.RED2};
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const Heading = styled(H4)`
    margin-bottom: 24px;
`;

export function AddVaultPage() {
    useTitle(t("add-vault-page.title"));
    const [pageType, setPageType] = useState<PageType>(PageType.Choose);
    const [vaultType, setVaultType] = useState<VaultType>(null);
    const errorRef = useRef<HTMLElement>(null);
    // **
    // ** Connect
    // **
    const [configuring, setConfiguring] = useState<boolean>(false);
    const [dropboxToken, setDropboxToken] = useSingleState(ADD_VAULT_STATE, "dropboxToken");
    const [error, setError] = useSingleState(ADD_VAULT_STATE, "error");
    useEffect(() => {
        setError(null);
        setDropboxToken(null);
    }, []);
    const handleConfiguration = useCallback(() => {
        setError(null);
        setConfiguring(true);
        processDropboxAuthentication();
    }, [vaultType]);
    useEffect(() => {
        if (error) {
            setConfiguring(false);
            if (errorRef.current) {
                console.log(errorRef.current);
                errorRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        }
    }, [error]);
    useEffect(() => {
        if (dropboxToken) {
            setPageType(PageType.Select);
        }
    }, [dropboxToken]);
    // **
    // ** Select
    // **
    const [selectedVaultPath, setSelectedVaultPath] = useState<string>(null);
    const [selectedIsNew, setSelectedIsNew] = useState<boolean>(false);
    const handleSelectedVaultChange = useCallback((filename: string, isNew: boolean) => {
        setSelectedVaultPath(filename);
        setSelectedIsNew(isNew);
    }, []);
    const handleSelectionConfirm = useCallback(() => {
        setPageType(PageType.Confirm);
    }, []);
    // **
    // ** Confirm
    // **
    const [addingVault, setAddingVault] = useState<boolean>(false);
    const handleConfirmation = useCallback((name: string, masterPassword: string) => {
        setAddingVault(true);
        addVaultDatasource({
            createNew: selectedIsNew,
            dropboxToken,
            masterPassword,
            name,
            type: vaultType,
            vaultPath: selectedVaultPath
        })
    }, [
        dropboxToken,
        selectedIsNew,
        selectedVaultPath,
        vaultType
    ]);
    return (
        <Layout title={t("add-vault-page.title")}>
            {pageType === PageType.Choose && (
                <Heading>{t("add-vault-page.section-type.heading")}</Heading>
            )}
            {pageType === PageType.Select && (
                <Heading>{t("add-vault-page.section-select.heading")}</Heading>
            )}
            {pageType === PageType.Confirm && (
                <Heading>{t("add-vault-page.section-confirm.heading")}</Heading>
            )}
            {error && vaultType && (
                <ErrorDescription intent={Intent.DANGER} innerRef={errorRef}>
                    <ErrorHeading>
                        {t(`vault-type.${vaultType}.add-error`)}
                    </ErrorHeading>
                    <p>{error}</p>
                </ErrorDescription>
            )}
            {pageType === PageType.Choose && (
                <>
                    <VaultTypeChooser
                        disabled={configuring}
                        onConfigure={handleConfiguration}
                        onSelectType={setVaultType}
                        selectedType={vaultType}
                    />
                </>
            )}
            {pageType === PageType.Select && (
                <>
                    <VaultFileChooser
                        confirmSelectedNew={selectedIsNew}
                        confirmSelectedVault={selectedVaultPath}
                        dropboxToken={dropboxToken}
                        onConfirmSelection={handleSelectionConfirm}
                        onSelectVault={handleSelectedVaultChange}
                        type={vaultType}
                    />
                </>
            )}
            {pageType === PageType.Confirm && (
                <>
                    <VaultConfirmation
                        adding={addingVault}
                        onConfirm={handleConfirmation}
                        vaultFilename={selectedVaultPath}
                        vaultIsNew={selectedIsNew}
                        vaultType={vaultType}
                    />
                </>
            )}
        </Layout>
    );
}
