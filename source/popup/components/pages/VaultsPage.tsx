import React, { useCallback } from "react";
import styled from "styled-components";
import { Button, ButtonGroup, NonIdealState } from "@blueprintjs/core";
// import { useVaultSources } from "../../../shared/hooks/vaultAppliance.js";
import { t } from "../../../shared/i18n/trans.js";
// import { openAddVaultPage } from "../../../shared/library/page.js";
import { VaultItemList } from "../vaults/VaultItemList.js";
import { getVaultsAppliance } from "../../services/vaultsAppliance.js";
import { useDesktopConnectionAvailable } from "../../hooks/desktop.js";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
`;
const NoVaultsState = styled(NonIdealState)`
    margin-top: 28px;
`;

export function VaultsPage() {
    const desktopConnected = useDesktopConnectionAvailable();
    const sources = []; //useVaultSources(getVaultsAppliance());
    const handleAddVaultClick = useCallback(() => {
        // openAddVaultPage();
    }, []);
    return (
        <Container>
            {desktopConnected === false && (
                <NoVaultsState
                    title={t("popup.vaults.empty.title")}
                    description={t("popup.vaults.empty.description")}
                    icon="folder-open"
                    action={(
                        <Button
                            icon="plus"
                            onClick={handleAddVaultClick}
                            text={t("popup.vaults.empty.action-text")}
                        />
                    )}
                />
            )}
            {sources.length === 0 && (
                <NoVaultsState
                    title={t("popup.vaults.empty.title")}
                    description={t("popup.vaults.empty.description")}
                    icon="folder-open"
                    action={(
                        <Button
                            icon="plus"
                            onClick={handleAddVaultClick}
                            text={t("popup.vaults.empty.action-text")}
                        />
                    )}
                />
            )}
            {sources.length > 0 && (
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
