import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import cn from "classnames";
import { Classes, Text } from "@blueprintjs/core";
import { SearchResult } from "buttercup";
import { SiteIcon } from "@buttercup/ui";
import { extractEntryDomain } from "../../../shared/library/domain.js";

interface EntryItemProps {
    entry: SearchResult;
    fetchIcons: boolean;
    onClick: () => void;
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
const EntryIconBackground = styled.div`
    width: 2.5rem;
    height: 2.5rem;
    flex: 0 0 auto;
    background-color: ${p => p.theme.backgroundColor};
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
        entry,
        fetchIcons,
        onClick
    } = props;
    const entryDomain = useMemo(() => {
        if (!fetchIcons) {
            return null;
        }
        return extractEntryDomain(entry.properties);
    }, [entry, fetchIcons]);
    const handleEntryClick = useCallback(() => {
        onClick();
    }, [onClick]);
    return (
        <Container isActive={false} onClick={handleEntryClick}>
            <EntryRow>
                <EntryIconBackground>
                    <EntryIcon
                        domain={entryDomain}
                        type={entry.entryType}
                    />
                </EntryIconBackground>
                <DetailRow onClick={() => {}}>
                    <Title title={entry.properties.title}>
                        <Text ellipsize>{entry.properties.title}</Text>
                    </Title>
                    <CenteredText ellipsize className={cn(Classes.TEXT_SMALL, Classes.TEXT_MUTED)}>
                        {entry.properties.username} {entry.properties.url && `@ ${entry.properties.url}` || ""}
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
