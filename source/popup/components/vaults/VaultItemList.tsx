import React, { Fragment, useCallback } from "react";
import styled from "styled-components";
import { Divider, Intent } from "@blueprintjs/core";
import { VaultItem } from "./VaultItem.js";
import { promptLockVault, promptUnlockVault } from "../../queries/desktop.js";
import { getToaster } from "../../../shared/services/notifications.js";
import { t } from "../../../shared/i18n/trans.js";
import { localisedErrorMessage } from "../../../shared/library/error.js";
import { VaultSourceDescription } from "../../types.js";

interface VaultItemListProps {
    vaults: Array<VaultSourceDescription>;
}

const ScrollList = styled.div`
    max-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
`;

export function VaultItemList(props: VaultItemListProps) {
    const handleVaultLockClick = useCallback((vault: VaultSourceDescription) => {
        promptLockVault(vault.id)
            .then(locked => {
                if (locked) {
                    getToaster().show({
                        intent: Intent.SUCCESS,
                        message: t("popup.vault.locking.success", { vault: vault.name }),
                        timeout: 4000
                    });
                }
            })
            .catch(err => {
                console.error(err);
                getToaster().show({
                    intent: Intent.DANGER,
                    message: t("popup.vault.locking.error", { message: localisedErrorMessage(err) }),
                    timeout: 10000
                });
            });
    }, []);
    const handleVaultUnlockClick = useCallback((vault: VaultSourceDescription) => {
        promptUnlockVault(vault.id).catch(err => {
            console.error(err);
            getToaster().show({
                intent: Intent.DANGER,
                message: t("popup.vault.unlocking.error", { message: localisedErrorMessage(err) }),
                timeout: 10000
            });
        });
    }, []);
    return (
        <>
            <ScrollList>
                {props.vaults.map((vault) => (
                    <Fragment key={vault.id}>
                        <VaultItem
                            onLockClick={() => handleVaultLockClick(vault)}
                            onUnlockClick={() => handleVaultUnlockClick(vault)}
                            vault={vault}
                        />
                        <Divider />
                    </Fragment>
                ))}
            </ScrollList>
        </>
    );
}
