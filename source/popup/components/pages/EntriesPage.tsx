import React from "react";
import styled from "styled-components";
import { Button, InputGroup } from "@blueprintjs/core";
import { t } from "../../../shared/i18n/trans.js";
import { useDesktopConnectionAvailable, useSearchedEntries } from "../../hooks/desktop.js";

interface EntriesPageProps {
    searchTerm: string;
}

interface EntriesPageControlsProps {
    onSearchTermChange: (term: string) => void;
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
            Entries: {entries.length}
        </Container>
    );
}

export function EntriesPageControls(props: EntriesPageControlsProps) {
    const isConnected = useDesktopConnectionAvailable();
    return (
        <>
            <Input
                disabled={!isConnected}
                onChange={evt => props.onSearchTermChange(evt.target.value)}
                placeholder={t("popup.entries.search.placeholder")}
                round
            />
            <Button
                disabled={!isConnected}
                icon="search"
                minimal
            />
        </>
    );
}
