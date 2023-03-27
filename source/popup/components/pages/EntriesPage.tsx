import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Button, InputGroup, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { SearchResult, VaultSourceStatus } from "buttercup";
import { t } from "../../../shared/i18n/trans.js";
import { useDesktopConnectionState, useEntriesForURL, useSearchedEntries, useVaultSources } from "../../hooks/desktop.js";
import { EntryItemList } from "../entries/EntryItemList.js";
import { LaunchContext } from "../contexts/LaunchContext.js";
import { sendEntryResultToTabForInput } from "../../services/tab.js";
import { DesktopConnectionState } from "../../types.js";

interface EntriesPageProps {
    onConnectClick: () => Promise<void>;
    onReconnectClick: () => Promise<void>;
    searchTerm: string;
}

interface EntriesPageControlsProps {
    onSearchTermChange: (term: string) => void;
    searchTerm: string;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
`;
const Input = styled(InputGroup)`
    margin-right: 2px !important;
`;
const InvalidState = styled(NonIdealState)`
    margin-top: 28px;
`;

export function EntriesPage(props: EntriesPageProps) {
    const desktopState = useDesktopConnectionState();
    return (
        <Container>
            {desktopState === DesktopConnectionState.NotConnected && (
                <InvalidState
                    title={t("popup.vaults.no-connection.title")}
                    description={t("popup.vaults.no-connection.description")}
                    icon="offline"
                    action={(
                        <Button
                            icon="link"
                            onClick={props.onConnectClick}
                            text={t("popup.vaults.no-connection.action-text")}
                        />
                    )}
                />
            )}
            {desktopState === DesktopConnectionState.Connected && (
                <EntriesPageList {...props} />
            )}
            {desktopState === DesktopConnectionState.Pending && (
                <Spinner size={40} />
            )}
            {desktopState === DesktopConnectionState.Error && (
                <InvalidState
                    title={t("popup.connection.check-error.title")}
                    description={t("popup.connection.check-error.description")}
                    icon="error"
                    intent={Intent.DANGER}
                    action={(
                        <Button
                            icon="link"
                            onClick={props.onReconnectClick}
                            text={t("popup.vaults.no-connection.action-text")}
                        />
                    )}
                />
            )}
        </Container>
    );
}

function EntriesPageList(props: EntriesPageProps) {
    const sources = useVaultSources();
    const unlockedCount = useMemo(
        () => sources.reduce(
            (count, source) => source.state === VaultSourceStatus.Unlocked ? count + 1 : count,
            0
        ),
        [sources]
    );
    const searchedEntries = useSearchedEntries(props.searchTerm);
    const { formID, source: popupSource, url } = useContext(LaunchContext);
    const urlEntries = useEntriesForURL(url);
    const handleEntryClick = useCallback((entry: SearchResult) => {
        if (popupSource === "page") {
            sendEntryResultToTabForInput(formID, entry);
        }
    }, [popupSource]);
    if (unlockedCount === 0) {
        return (
            <InvalidState
                title={t("popup.entries.all-locked.title")}
                description={t("popup.entries.all-locked.description")}
                icon="folder-close"
            />
        );
    }
    return (
        <EntryItemList
            entries={searchedEntries.length > 0 ? searchedEntries : urlEntries}
            onEntryClick={handleEntryClick}
        />
    );
}

export function EntriesPageControls(props: EntriesPageControlsProps) {
    const desktopState = useDesktopConnectionState();
    return (
        <>
            <Input
                disabled={desktopState !== DesktopConnectionState.Connected}
                onChange={evt => props.onSearchTermChange(evt.target.value)}
                placeholder={t("popup.entries.search.placeholder")}
                round
                value={props.searchTerm}
            />
            <Button
                disabled={desktopState !== DesktopConnectionState.Connected}
                icon="search"
                minimal
            />
        </>
    );
}