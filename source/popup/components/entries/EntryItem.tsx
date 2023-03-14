import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import cn from "classnames";
import { Button, ButtonGroup, Classes, Text } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import { EntryURLType, getEntryURLs, SearchResult, VaultSourceStatus } from "buttercup";
import { SiteIcon } from "@buttercup/ui";
import { VAULT_TYPES } from "../../../shared/library/vaultTypes.js";
import { t } from "../../../shared/i18n/trans.js";
import { VaultSourceDescription } from "../../types.js";
import { extractDomain } from "../../../shared/library/domain.js";
// import { VaultStateIndicator } from "./VaultStateIndicator.js";

interface EntryItemProps {
    entry: SearchResult;
    // isDetailsVisible: boolean;
    // onRemoveClick: () => void;
    // onUnlockClick: () => void;
    // vault: VaultSourceDescription;
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
const EntryIcon = styled(SiteIcon)`
    width: 100%;
    height: 100%;
    > img {
        width: 100%;
        height: 100%;
    }
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
const EntryIconBackground = styled.div`
    width: 2.5rem;
    height: 2.5rem;
    flex: 0 0 auto;
    background-color: ${p => p.theme.backgroundColor};
    // display: flex;
    // justify-content: stretch;
    // align-items: stretch;
    border-radius: 3px;
    border: 1px solid ${p => p.theme.listItemHover};
`;
const EntryRow = styled.div`
    flex: 1;
    width: 100%;
    display: flex;
    cursor: pointer;
    align-items: center;
`;

export function EntryItem(props: EntryItemProps) {
    const {
        entry
        // isDetailsVisible,
        // onRemoveClick,
        // onUnlockClick,
        // vault
    } = props;
    const entryDomain = useMemo(() => {
        const [url] = [
            ...getEntryURLs(entry.properties, EntryURLType.Icon),
            ...getEntryURLs(entry.properties, EntryURLType.Any)
        ];
        return url ? extractDomain(url) : null;
    }, [entry]);
    // const vaultImage = VAULT_TYPES[vault.type].image;
    // const handleVaultClick = useCallback(() => {
    //     // @todo
    // }, [vault]);
    // const handleLockUnlockClick = useCallback(() => {
    //     if (vault.state === VaultSourceStatus.Locked) {
    //         onUnlockClick();
    //     } else if (vault.state === VaultSourceStatus.Unlocked) {
    //         // @todo
    //     }
    // }, [vault, onUnlockClick]);
    // const handleRemoveClick = useCallback(() => {
    //     onRemoveClick();
    // }, [vault, onRemoveClick]);
    return (
        <Container isActive={false}>
            <EntryRow>
                <EntryIconBackground>
                    {/* <VaultIcon src={vaultImage} /> */}
                    <EntryIcon
                        domain={entryDomain}
                    />
                </EntryIconBackground>
                <DetailRow onClick={() => {}}>
                    <Title title={entry.properties.title}>
                        <Text ellipsize>{entry.properties.title}</Text>
                    </Title>
                    <CenteredText ellipsize className={cn(Classes.TEXT_SMALL, Classes.TEXT_MUTED)}>
                        {/* <VaultStateIndicator state={vault.state} />&nbsp; */}
                        {/* {t(`vault-state.${vault.state}`)} */}
                        Test
                    </CenteredText>
                </DetailRow>
                {/* <ButtonGroup>
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
                            onClick={handleLockUnlockClick}
                        />
                    </Tooltip2>
                    <Tooltip2 content={t("popup.vault.remove")}>
                        <Button
                            icon="remove"
                            loading={vault.state === VaultSourceStatus.Pending}
                            minimal
                            onClick={handleRemoveClick}
                        />
                    </Tooltip2>
                </ButtonGroup> */}
            </EntryRow>
        </Container>
    );
}
