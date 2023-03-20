import React from "react";
import styled from "styled-components";
import { Button, InputGroup } from "@blueprintjs/core";
import { t } from "../../../shared/i18n/trans.js";
import { useDesktopConnectionState, useSearchedEntries } from "../../hooks/desktop.js";
import { EntryItemList } from "../entries/EntryItemList.js";
import { DesktopConnectionState } from "../../types.js";

interface EntriesPageProps {
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

export function EntriesPage(props: EntriesPageProps) {
    const entries = useSearchedEntries(props.searchTerm);
    return (
        <Container>
            <EntryItemList entries={entries} />
        </Container>
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
