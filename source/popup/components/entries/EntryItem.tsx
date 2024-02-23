import React, { MouseEvent, useCallback, useContext, useMemo } from "react";
import styled from "styled-components";
import cn from "classnames";
import { Button, ButtonGroup, Classes, Text } from "@blueprintjs/core";
import { SearchResult, VaultSourceStatus } from "buttercup";
import { SiteIcon } from "@buttercup/ui";
import { LaunchContext } from "../contexts/LaunchContext.js";
import { extractEntryDomain } from "../../../shared/library/domain.js";
import { Tooltip2 } from "@blueprintjs/popover2";
import { t } from "../../../shared/i18n/trans.js";

interface EntryItemProps {
    entry: SearchResult;
    fetchIcons: boolean;
    onAutoClick: () => void;
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
        onAutoClick,
        onClick
    } = props;
    const { source: popupSource } = useContext(LaunchContext);
    const entryDomain = useMemo(() => {
        if (!fetchIcons) {
            return null;
        }
        return extractEntryDomain(entry.properties);
    }, [entry, fetchIcons]);
    const handleEntryClick = useCallback(
        (evt: MouseEvent) => {
            evt.preventDefault();
            evt.stopPropagation();
            onClick();
        },
        [onClick]
    );
    const handleEntryLoginClick = useCallback(
        (evt: MouseEvent) => {
            evt.preventDefault();
            evt.stopPropagation();
            onAutoClick();
        },
        [onAutoClick]
    );
    return (
        <Container isActive={false} onClick={handleEntryClick}>
            <EntryRow>
                <EntryIconBackground>
                    <EntryIcon
                        domain={entryDomain}
                        type={entry.entryType}
                    />
                </EntryIconBackground>
                <DetailRow>
                    <Title title={entry.properties.title}>
                        <Text ellipsize>{entry.properties.title}</Text>
                    </Title>
                    <CenteredText ellipsize className={cn(Classes.TEXT_SMALL, Classes.TEXT_MUTED)}>
                        {entry.properties.username} {entry.properties.url && `@ ${entry.properties.url}` || ""}
                    </CenteredText>
                </DetailRow>
                {popupSource === "popup" && (
                    <ButtonGroup>
                        <Tooltip2
                            content={t("popup.entries.auto-login.tooltip")}
                        >
                            <Button
                                icon="text-highlight"
                                minimal
                                onClick={handleEntryLoginClick}
                            />
                        </Tooltip2>
                    </ButtonGroup>
                )}
            </EntryRow>
        </Container>
    );
}
