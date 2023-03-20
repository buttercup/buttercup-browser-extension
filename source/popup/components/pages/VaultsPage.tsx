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

interface VaultsPageProps {
    onConnectClick: () => Promise<void>;
    onReconnectClick: () => Promise<void>;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
`;
const InvalidState = styled(NonIdealState)`
    margin-top: 28px;
`;

export function VaultsPage(props: VaultsPageProps) {
    const desktopState = useDesktopConnectionState();
    return (
        <Container>
            {desktopState === DesktopConnectionState.NotConnected && (
                <InvalidState
                    title={t("popup.vaults.no-connection.title")}
                    description={t("popup.vaults.no-connection.description")}
                    icon="offline"
                    action={(
                        <Button
                            icon="link"
                            onClick={props.onConnectClick}
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
                <InvalidState
                    title={t("popup.connection.check-error.title")}
                    description={t("popup.connection.check-error.description")}
                    icon="error"
                    intent={Intent.DANGER}
                    action={(
                        <Button
                            icon="link"
                            onClick={props.onReconnectClick}
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
            <InvalidState
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
