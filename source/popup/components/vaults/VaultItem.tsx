import React, { useCallback } from "react";
import styled from "styled-components";
import cn from "classnames";
import { Button, ButtonGroup, Classes, Dialog, Text } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import { VaultSourceStatus } from "buttercup";
import { VAULT_TYPES } from "../../../shared/library/vaultTypes.js";
import { t } from "../../../shared/i18n/trans.js";
import { VaultSourceDescription } from "../../types.js";

interface VaultItemProps {
    isDetailsVisible: boolean;
    vault: VaultSourceDescription;
}

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
const Details = styled.div`
    overflow: auto;
    margin: 0 !important;
    padding: 20px !important;
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
        isDetailsVisible,
        vault
    } = props;
    const vaultImage = VAULT_TYPES[vault.type].image;
    const handleVaultClick = useCallback(() => {

    }, [vault]);
    const handleLockUnlockClick = useCallback(() => {

    }, [vault]);
    const handleRemoveClick = useCallback(() => {

    }, [vault]);
    return (
        <>
            <Container isActive={isDetailsVisible}>
                <VaultRow>
                    <VaultImageBackground>
                        <VaultIcon src={vaultImage} />
                    </VaultImageBackground>
                    <DetailRow onClick={() => handleVaultClick()}>
                        <Title title={vault.name}>
                            <Text ellipsize>{vault.name}</Text>
                        </Title>
                        <Text ellipsize className={cn(Classes.TEXT_SMALL, Classes.TEXT_MUTED)}>
                            {vault.state}
                        </Text>
                    </DetailRow>
                    <ButtonGroup>
                        <Tooltip2
                            content={
                                vault.state === VaultSourceStatus.Locked
                                    ? t("popup.vault.unlock")
                                    : vault.state === VaultSourceStatus.Unlocked
                                        ? t("popup.vault.lock")
                                        : t("popup.vault.state-pending")
                            }
                        >
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
                                onClick={() =>
                                    handleLockUnlockClick()
                                }
                            />
                        </Tooltip2>
                        <Tooltip2 content={t("popup.vault.remove")}>
                            <Button
                                icon="remove"
                                loading={vault.state === VaultSourceStatus.Pending}
                                minimal
                                onClick={() =>
                                    handleRemoveClick()
                                }
                            />
                        </Tooltip2>
                    </ButtonGroup>
                </VaultRow>
            </Container>
            <Dialog
                title={vault.name}
                isOpen={isDetailsVisible}
                onClose={() => this.toggleDetails()}
                style={{
                    margin: "1rem",
                    height: "calc(100vh - 2rem)",
                    width: "calc(100vw - 2rem)",
                    paddingBottom: "10px"
                }}
                usePortal={false}
            >
                {/* {this.renderEntryDetails()} */}
                <span>Test</span>
                <div className={Classes.DIALOG_FOOTER}>
                    <Text className={cn(Classes.TEXT_MUTED, Classes.TEXT_SMALL)}>{vault.state}</Text>
                </div>
            </Dialog>
        </>
    );
}
