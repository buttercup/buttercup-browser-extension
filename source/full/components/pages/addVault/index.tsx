import React, { useCallback, useEffect, useState } from "react";
import { Card, Colors, H4, H5, Icon, Intent } from "@blueprintjs/core";
import styled from "styled-components";
import { useSingleState } from "react-obstate";
import { Layout } from "../../Layout.js";
import { t } from "../../../../shared/i18n/trans.js";
import { useTitle } from "../../../hooks/document.js";
import { VaultTypeChooser } from "./VaultTypeChooser.js";
import { VaultFileChooser } from "./VaultFileChooser.js";
import { processDropboxAuthentication } from "../../../services/datasource.js";
import { ADD_VAULT_STATE } from "../../../state/addVault.js";
import { VaultType } from "../../../types.js";

enum PageType {
    Choose = "choose",
    Select = "select"
}

const ErrorDescription = styled(Card)`
    margin-top: 24px;
`;
const ErrorHeading = styled(H5)`
    color: ${Colors.RED2};
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const ErrorHeadingIcon = styled(Icon)`
    fill: ${Colors.RED2};
    margin-right: 8px;
`;
const Heading = styled(H4)`
    margin-bottom: 24px;
`;

export function AddVaultPage() {
    useTitle(t("add-vault-page.title"));
    const [pageType, setPageType] = useState<PageType>(PageType.Choose);
    const [vaultType, setVaultType] = useState<VaultType>(null);
    // **
    // ** Connect
    // **
    const [configuring, setConfiguring] = useState<boolean>(false);
    const [dropboxToken, setDropboxToken] = useSingleState(ADD_VAULT_STATE, "dropboxToken");
    const [authError, setAuthError] = useSingleState(ADD_VAULT_STATE, "authError");
    useEffect(() => {
        setAuthError(null);
        setDropboxToken(null);
    }, []);
    const handleConfiguration = useCallback(() => {
        setAuthError(null);
        setConfiguring(true);
        processDropboxAuthentication();
    }, [vaultType]);
    useEffect(() => {
        if (authError) {
            setConfiguring(false);
        }
    }, [authError]);
    useEffect(() => {
        if (dropboxToken) {
            setPageType(PageType.Select);
        }
    }, [dropboxToken]);
    // **
    // ** Select
    // **
    
    return (
        <Layout title={t("add-vault-page.title")}>
            {pageType === PageType.Choose && (
                <>
                    <Heading>{t("add-vault-page.section-type.heading")}</Heading>
                    <VaultTypeChooser
                        disabled={configuring}
                        onConfigure={handleConfiguration}
                        onSelectType={setVaultType}
                        selectedType={vaultType}
                    />
                    {authError && vaultType && (
                        <ErrorDescription intent={Intent.DANGER}>
                            <ErrorHeading>
                                <ErrorHeadingIcon icon="issue" />
                                {t(`vault-type.${vaultType}.auth-error`)}
                            </ErrorHeading>
                            <p>{authError}</p>
                        </ErrorDescription>
                    )}
                </>
            )}
            {pageType === PageType.Select && (
                <>
                    <Heading>{t("add-vault-page.section-select.heading")}</Heading>
                    <VaultFileChooser
                        dropboxToken={dropboxToken}
                        type={vaultType}
                    />
                </>
            )}
        </Layout>
    );
}
