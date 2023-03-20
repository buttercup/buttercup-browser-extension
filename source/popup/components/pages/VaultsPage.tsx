import React, { useCallback } from "react";
import styled from "styled-components";
import { Button, ButtonGroup, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { t } from "../../../shared/i18n/trans.js";
import { VaultItemList } from "../vaults/VaultItemList.js";
import { useDesktopConnectionState, useVaultSources } from "../../hooks/desktop.js";
import { clearDesktopConnectionAuth, initiateDesktopConnectionRequest } from "../../queries/desktop.js";
import { createNewTab, getExtensionURL } from "../../../shared/library/extension.js";
import { getToaster } from "../../../shared/services/notifications.js";
import { localisedErrorMessage } from "../../../shared/library/error.js";
import { DesktopConnectionState } from "../../types.js";

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
    const desktopState = useDesktopConnectionState();
    const handleConnectClick = useCallback(async () => {
        try {
            await initiateDesktopConnectionRequest();
            await createNewTab(getExtensionURL("full.html#/connect"));
        } catch (err) {
            console.error(err);
            getToaster().show({
                intent: Intent.DANGER,
                message: t("popup.connection.open-error", { message: localisedErrorMessage(err) }),
                timeout: 10000
            });
        }
    }, []);
    const handleReconnectClick = useCallback(async () => {
        try {
            await clearDesktopConnectionAuth();
        } catch (err) {
            console.error(err);
            getToaster().show({
                intent: Intent.DANGER,
                message: t("popup.connection.reauth-error", { message: localisedErrorMessage(err) }),
                timeout: 10000
            });
            return;
        }
        await handleConnectClick();
    }, [handleConnectClick]);
    return (
        <Container>
            {desktopState === DesktopConnectionState.NotConnected && (
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
            {desktopState === DesktopConnectionState.Connected && (
                <VaultsPageList />
            )}
            {desktopState === DesktopConnectionState.Pending && (
                <Spinner size={40} />
            )}
            {desktopState === DesktopConnectionState.Error && (
                <NoVaultsState
                    title={t("popup.connection.check-error.title")}
                    description={t("popup.connection.check-error.description")}
                    icon="error"
                    intent={Intent.DANGER}
                    action={(
                        <Button
                            icon="link"
                            onClick={handleReconnectClick}
                            text={t("popup.vaults.no-connection.action-text")}
                        />
                    )}
                />
            )}
        </Container>
    );
}

function VaultsPageList() {
    const sources = useVaultSources();
    if (sources.length === 0) {
        return (
            <NoVaultsState
                title={t("popup.vaults.empty.title")}
                description={t("popup.vaults.empty.description")}
                icon="folder-open"
            />
        );
    }
    return (
        <VaultItemList
            vaults={sources}
        />
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
