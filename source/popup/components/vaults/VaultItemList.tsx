import React, { Fragment, KeyboardEvent, useCallback, useState } from "react";
import styled from "styled-components";
import cn from "classnames";
import { Classes, Dialog, Divider, FormGroup, H4, InputGroup, Intent, Overlay, Spinner, Text } from "@blueprintjs/core";
import { VaultItem } from "./VaultItem.js";
import { unlockSource } from "../../services/vaults.js";
import { t } from "../../../shared/i18n/trans.js";
import { VaultSourceDescription } from "../../types.js";
import { getToaster } from "../../../shared/services/notifications.js";

interface VaultItemListProps {
    vaults: Array<VaultSourceDescription>;
}

const OverlayBody = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;
const OverlayContainer = styled(Overlay)`
    display: flex;
    justify-content: center;
    align-items: center;
`;
const ScrollList = styled.div`
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
`;

export function VaultItemList(props: VaultItemListProps) {
    const [unlockVault, setUnlockVault] = useState<VaultSourceDescription>(null);
    const [vaultPassword, setVaultPassword] = useState<string>("");
    const [workAlert, setWorkAlert] = useState<{ title: string; description: string; }>(null);
    const handleDialogClose = useCallback(() => {
        setVaultPassword("");
        setUnlockVault(null);
    }, []);
    const handleVaultUnlockClick = useCallback((vault: VaultSourceDescription) => {
        setUnlockVault(vault);
    }, []);
    const handleVaultUnlock = useCallback(() => {
        setWorkAlert({
            title: t("popup.vault.unlocking.title"),
            description: t("popup.vault.unlocking.description")
        });
        unlockSource(unlockVault.id, vaultPassword)
            .then(() => {
                getToaster().show({
                    intent: Intent.SUCCESS,
                    message: t("popup.vault.unlocking.success", { vault: unlockVault.name }),
                    timeout: 10000
                });
                handleDialogClose();
                setWorkAlert(null);
            })
            .catch(err => {
                console.error(err);
                setWorkAlert(null);
                getToaster().show({
                    intent: Intent.DANGER,
                    message: t("popup.vault.unlocking.error", { message: err.message }),
                    timeout: 10000
                });
            });
    }, [handleDialogClose, unlockVault, vaultPassword]);
    const handleUnlockKeyPress = useCallback((event: KeyboardEvent) => {
        if (event.key === "Enter" && !event.ctrlKey && !event.shiftKey) {
            handleVaultUnlock();
        }
    }, [handleVaultUnlock]);
    return (
        <>
            <ScrollList>
                {props.vaults.map((vault) => (
                    <Fragment key={vault.id}>
                        <VaultItem
                            isDetailsVisible={false}
                            onUnlockClick={() => handleVaultUnlockClick(vault)}
                            vault={vault}
                        />
                        <Divider />
                    </Fragment>
                ))}
            </ScrollList>
            {unlockVault && (
                <Dialog
                    title={t("popup.vault.unlock-dialog.title", { title: unlockVault.name })}
                    isOpen
                    onClose={handleDialogClose}
                    style={{
                        margin: "1rem",
                        height: "calc(100vh - 2rem)",
                        width: "calc(100vw - 2rem)",
                        paddingBottom: "10px"
                    }}
                    usePortal={false}
                >
                    <div className={Classes.DIALOG_BODY}>
                        <FormGroup
                            label={t("popup.vault.unlock-dialog.password-label")}
                            labelFor="vault-password"
                        >
                            <InputGroup
                                id="vault-password"
                                autoFocus
                                onChange={(event) => setVaultPassword(event.target.value)}
                                onKeyPress={handleUnlockKeyPress}
                                type="password"
                                value={vaultPassword}
                            />
                        </FormGroup>
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <Text className={cn(Classes.TEXT_MUTED, Classes.TEXT_SMALL)}>
                            {unlockVault.state}
                        </Text>
                    </div>
                </Dialog>
            )}
            {workAlert && (
                <OverlayContainer
                    canEscapeKeyClose={false}
                    canOutsideClickClose={false}
                    className={Classes.OVERLAY_SCROLL_CONTAINER}
                    hasBackdrop
                    isOpen
                >
                    <OverlayBody className={cn(Classes.CARD, Classes.ELEVATION_2)}>
                        <Spinner size={30} />
                        <br />
                        <H4>{workAlert.title}</H4>
                        <Text>{workAlert.description}</Text>
                    </OverlayBody>
                </OverlayContainer>
            )}
        </>
    );
}
