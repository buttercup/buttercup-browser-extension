import React, { Fragment, KeyboardEvent, useCallback, useState } from "react";
import styled from "styled-components";
import cn from "classnames";
import { SearchResult } from "buttercup";
import { Button, Classes, Dialog, Divider, FormGroup, InputGroup, Intent, Text } from "@blueprintjs/core";
import { unlockSource } from "../../services/vaults.js";
import { t } from "../../../shared/i18n/trans.js";
import { getToaster } from "../../../shared/services/notifications.js";
import { BusyLoader } from "../../../shared/components/loading/BusyLoader.js";
import { localisedErrorMessage } from "../../../shared/library/error.js";
import { VaultSourceDescription } from "../../types.js";
import { EntryItem } from "./EntryItem.js";

interface EntryItemListProps {
    entries: Array<SearchResult>;
}

const ButtonRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-start;

    > button:not(:last-child) {
        margin-right: 6px;
    }
`;
const ScrollList = styled.div`
    max-height: 100%;
    // overflow-x: hidden;
    // overflow-y: scroll;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
`;

export function EntryItemList(props: EntryItemListProps) {
    // const [unlockVault, setUnlockVault] = useState<VaultSourceDescription>(null);
    // const [removeVault, setRemoveVault] = useState<VaultSourceDescription>(null);
    // const [vaultPassword, setVaultPassword] = useState<string>("");
    // const [workAlert, setWorkAlert] = useState<{ title: string; description: string; }>(null);
    // const handleDialogClose = useCallback(() => {
    //     setVaultPassword("");
    //     setUnlockVault(null);
    //     setRemoveVault(null);
    // }, []);
    // const handleVaultUnlockClick = useCallback((vault: VaultSourceDescription) => {
    //     setUnlockVault(vault);
    // }, []);
    // const handleVaultUnlock = useCallback(() => {
    //     if (vaultPassword.trim().length <= 0) {
    //         getToaster().show({
    //             intent: Intent.WARNING,
    //             message: t("popup.vault.unlocking.invalid-password"),
    //             timeout: 5000
    //         });
    //         return;
    //     }
    //     setWorkAlert({
    //         title: t("popup.vault.unlocking.title"),
    //         description: t("popup.vault.unlocking.description")
    //     });
    //     unlockSource(unlockVault.id)
    //         .then(() => {
    //             getToaster().show({
    //                 intent: Intent.SUCCESS,
    //                 message: t("popup.vault.unlocking.success", { vault: unlockVault.name }),
    //                 timeout: 4000
    //             });
    //             handleDialogClose();
    //             setWorkAlert(null);
    //         })
    //         .catch(err => {
    //             console.error(err);
    //             setWorkAlert(null);
    //             getToaster().show({
    //                 intent: Intent.DANGER,
    //                 message: t("popup.vault.unlocking.error", { message: localisedErrorMessage(err) }),
    //                 timeout: 10000
    //             });
    //         });
    // }, [handleDialogClose, unlockVault, vaultPassword]);
    // const handleVaultRemoveClick = useCallback((vault: VaultSourceDescription) => {
    //     setRemoveVault(vault);
    // }, []);
    // const handleVaultRemove = useCallback(() => {
    //     setWorkAlert({
    //         title: t("popup.vault.removing.title"),
    //         description: t("popup.vault.removing.description")
    //     });
    //     const vaultName = removeVault.name;
    //     removeSource(removeVault.id)
    //         .then(() => {
    //             getToaster().show({
    //                 intent: Intent.SUCCESS,
    //                 message: t("popup.vault.removing.success", { vault: vaultName }),
    //                 timeout: 4000
    //             });
    //             handleDialogClose();
    //             setWorkAlert(null);
    //         })
    //         .catch(err => {
    //             console.error(err);
    //             setWorkAlert(null);
    //             getToaster().show({
    //                 intent: Intent.DANGER,
    //                 message: t("popup.vault.removing.error", { message: err.message }),
    //                 timeout: 10000
    //             });
    //         });
    // }, [handleDialogClose, removeVault]);
    // const handleUnlockKeyPress = useCallback((event: KeyboardEvent) => {
    //     if (event.key === "Enter" && !event.ctrlKey && !event.shiftKey) {
    //         handleVaultUnlock();
    //     }
    // }, [handleVaultUnlock]);
    return (
        <>
            <ScrollList>
                {props.entries.map((entry) => (
                    <Fragment key={entry.id}>
                        <EntryItem
                            entry={entry}
                            // isDetailsVisible={false}
                            // onRemoveClick={() => handleVaultRemoveClick(vault)}
                            // onUnlockClick={() => handleVaultUnlockClick(vault)}
                            // vault={vault}
                        />
                        <Divider />
                    </Fragment>
                ))}
            </ScrollList>
            {/* {unlockVault && (
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
                        <ButtonRow>
                            <Button
                                intent={Intent.PRIMARY}
                                onClick={handleVaultUnlock}
                                text={t("popup.vault.unlock-dialog.unlock-button")}
                            />
                            <Button
                                onClick={handleDialogClose}
                                text={t("popup.vault.unlock-dialog.cancel-button")}
                            />
                        </ButtonRow>
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <Text className={cn(Classes.TEXT_MUTED, Classes.TEXT_SMALL)}>
                            {unlockVault.state}
                        </Text>
                    </div>
                </Dialog>
            )} */}
            {/* {removeVault && (
                <Alert
                    cancelButtonText={t("popup.vault.remove-dialog.cancel-button")}
                    confirmButtonText={t("popup.vault.remove-dialog.confirm-button")}
                    icon="trash"
                    intent={Intent.DANGER}
                    isOpen
                    loading={!!workAlert}
                    onCancel={handleDialogClose}
                    onConfirm={handleVaultRemove}
                >
                    <p dangerouslySetInnerHTML={{ __html: t("popup.vault.remove-dialog.message", { vault: removeVault.name }) }} />
                </Alert>
            )} */}
            {/* {workAlert && (
                <BusyLoader
                    description={workAlert.description}
                    title={workAlert.title}
                />
            )} */}
        </>
    );
}
