import React, { Fragment} from "react";
import styled from "styled-components";
import { SearchResult } from "buttercup";
import { Divider} from "@blueprintjs/core";
import { EntryItem } from "./EntryItem.js";
import { useConfig } from "../../../shared/hooks/config.js";

interface EntryItemListProps {
    entries: Array<SearchResult>;
    onEntryClick: (entry: SearchResult) => void;
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
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
`;

export function EntryItemList(props: EntryItemListProps) {
    const [config] = useConfig();
    return (
        <>
            <ScrollList>
                {props.entries.map((entry) => (
                    <Fragment key={entry.id}>
                        <EntryItem
                            entry={entry}
                            fetchIcons={config.entryIcons}
                            onClick={() => props.onEntryClick(entry)}
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
