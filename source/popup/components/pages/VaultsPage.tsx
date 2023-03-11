import React, { useCallback } from "react";
import styled from "styled-components";
import { Button, ButtonGroup, Intent, NonIdealState } from "@blueprintjs/core";
import { t } from "../../../shared/i18n/trans.js";
import { VaultItemList } from "../vaults/VaultItemList.js";
import { useDesktopConnectionAvailable, useVaultSources } from "../../hooks/desktop.js";
import { initiateDesktopConnectionRequest } from "../../queries/desktop.js";
import { createNewTab, getExtensionURL } from "../../../shared/library/extension.js";
import { getToaster } from "../../../shared/services/notifications.js";
import { localisedErrorMessage } from "../../../shared/library/error.js";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
`;
const NotConnectedState = styled(NonIdealState)`
    margin-top: 28px;
`;
const NoVaultsState = styled(NonIdealState)`
    margin-top: 28px;
`;

export function VaultsPage() {
    const desktopConnected = useDesktopConnectionAvailable();
    const sources = useVaultSources();
    const handleConnectClick = useCallback(async () => {
        try {
            await initiateDesktopConnectionRequest();
            await createNewTab(getExtensionURL("full.html#/connect"));
        } catch (err) {
            console.error(err);
            getToaster().show({
                intent: Intent.DANGER,
                message: t("popup.vault.connect.open-error", { message: localisedErrorMessage(err) }),
                timeout: 10000
            });
        }
    }, []);
    // const handleAddVaultClick = useCallback(() => {
    //     // openAddVaultPage();
    // }, []);
    return (
        <Container>
            {desktopConnected === false && (
                <NotConnectedState
                    title={t("popup.vaults.no-connection.title")}
                    description={t("popup.vaults.no-connection.description")}
                    icon="offline"
                    action={(
                        <Button
                            icon="link"
                            onClick={handleConnectClick}
                            text={t("popup.vaults.no-connection.action-text")}
                        />
                    )}
                />
            )}
            {desktopConnected === true && sources.length === 0 && (
                <NoVaultsState
                    title={t("popup.vaults.empty.title")}
                    description={t("popup.vaults.empty.description")}
                    icon="folder-open"
                    // action={(
                    //     <Button
                    //         icon="plus"
                    //         onClick={handleAddVaultClick}
                    //         text={t("popup.vaults.empty.action-text")}
                    //     />
                    // )}
                />
            )}
            {desktopConnected === true && sources.length > 0 && (
                <VaultItemList
                    vaults={sources}
                />
            )}
        </Container>
    );
}

export function VaultsPageControls() {
    const handleAddVaultClick = useCallback(() => {
        // openAddVaultPage();
    }, []);
    return (
        <ButtonGroup>
            <Button
                icon="add"
                minimal
                onClick={handleAddVaultClick}
            />
            <Button
                icon="lock"
                minimal
            />
        </ButtonGroup>
    );
}
