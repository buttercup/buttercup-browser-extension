import React, { useCallback } from "react";
import styled from "styled-components";
import cn from "classnames";
import { Button, ButtonGroup, Classes, Text } from "@blueprintjs/core";
import { VaultSourceStatus } from "buttercup";
import { VAULT_TYPES } from "../../../shared/library/vaultTypes.js";
import { t } from "../../../shared/i18n/trans.js";
import { VaultSourceDescription } from "../../types.js";
import { VaultStateIndicator } from "./VaultStateIndicator.js";

interface VaultItemProps {
    onLockClick: () => void;
    onUnlockClick: () => void;
    vault: VaultSourceDescription;
}

const CenteredText = styled(Text)`
    display: flex;
    align-items: center;
`;
const Container = styled.div`
    border-radius: 3px;
    padding: 0.5rem;
    background-color: ${p => (p.isActive ? p.theme.listItemHover : null)};
    position: relative;
    &:hover {
        background-color: ${p => p.theme.listItemHover};
    }
`;
const DetailRow = styled.div`
    margin-left: 0.5rem;
    overflow: hidden;
    flex: 1;
`;
const Title = styled(Text)`
    margin-bottom: 0.3rem;
`;
const VaultIcon = styled.img`
    width: calc(100% - 6px);
    height: calc(100% - 6px);
    margin: 3px;
    overflow: hidden;
`;
const VaultImageBackground = styled.div`
    width: 2.5rem;
    height: 2.5rem;
    flex: 0 0 auto;
    background-color: ${p => p.theme.backgroundColor};
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    border-radius: 3px;
    border: 1px solid ${p => p.theme.listItemHover};
`;
const VaultRow = styled.div`
    flex: 1;
    width: 100%;
    display: flex;
    cursor: pointer;
    align-items: center;
`;

export function VaultItem(props: VaultItemProps) {
    const {
        onLockClick,
        onUnlockClick,
        vault
    } = props;
    const vaultImage = VAULT_TYPES[vault.type].image;
    const handleVaultClick = useCallback(() => {
        // @todo
    }, [vault]);
    const handleLockUnlockClick = useCallback(() => {
        if (vault.state === VaultSourceStatus.Locked) {
            onUnlockClick();
        } else if (vault.state === VaultSourceStatus.Unlocked) {
            onLockClick();
        }
    }, [vault, onUnlockClick]);
    return (
        <Container>
            <VaultRow>
                <VaultImageBackground>
                    <VaultIcon src={vaultImage} />
                </VaultImageBackground>
                <DetailRow onClick={handleVaultClick}>
                    <Title title={vault.name}>
                        <Text ellipsize>{vault.name}</Text>
                    </Title>
                    <CenteredText ellipsize className={cn(Classes.TEXT_SMALL, Classes.TEXT_MUTED)}>
                        <VaultStateIndicator state={vault.state} />&nbsp;
                        {t(`vault-state.${vault.state}`)}
                    </CenteredText>
                </DetailRow>
                <ButtonGroup>
                    <Button
                        icon={
                            vault.state === VaultSourceStatus.Locked
                                ? "unlock"
                                : vault.state === VaultSourceStatus.Unlocked
                                    ? "lock"
                                    : "help"
                        }
                        loading={vault.state === VaultSourceStatus.Pending}
                        minimal
                        onClick={handleLockUnlockClick}
                    />
                </ButtonGroup>
            </VaultRow>
        </Container>
    );
}
