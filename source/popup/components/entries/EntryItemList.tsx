import React, { Fragment } from "react";
import styled from "styled-components";
import { SearchResult } from "buttercup";
import { Divider, H4} from "@blueprintjs/core";
import { EntryItem } from "./EntryItem.js";
import { useConfig } from "../../../shared/hooks/config.js";
import { t } from "../../../shared/i18n/trans.js";

interface EntryItemListProps {
    entries: Array<SearchResult> | Record<string, Array<SearchResult>>;
    onEntryAutoClick: (entry: SearchResult) => void;
    onEntryClick: (entry: SearchResult) => void;
    onEntryInfoClick: (entry: SearchResult) => void;
}

const ScrollList = styled.div`
    max-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
`;

export function EntryItemList(props: EntryItemListProps) {
    const { entries, onEntryAutoClick, onEntryClick, onEntryInfoClick } = props;
    const [config] = useConfig();
    if (!config) return null;
    return (
        <ScrollList>
            {Array.isArray(entries) && (
                <>
                    {entries.map((entry) => (
                        <Fragment key={entry.id}>
                            <EntryItem
                                entry={entry}
                                fetchIcons={config.entryIcons}
                                onAutoClick={() => onEntryAutoClick(entry)}
                                onClick={() => onEntryClick(entry)}
                                onInfoClick={() => onEntryInfoClick(entry)}
                            />
                            <Divider />
                        </Fragment>
                    ))}
                </>
            ) || (
                <>
                    {Object.keys(entries).map(sectionName => (
                        <Fragment key={sectionName}>
                            {entries[sectionName].length > 0 && (
                                <Fragment key={`en-${sectionName}`}>
                                    <H4>{t(sectionName)}</H4>
                                    {entries[sectionName].map((entry: SearchResult) => (
                                        <Fragment key={entry.id}>
                                            <EntryItem
                                                entry={entry}
                                                fetchIcons={config.entryIcons}
                                                onAutoClick={() => onEntryAutoClick(entry)}
                                                onClick={() => onEntryClick(entry)}
                                                onInfoClick={() => onEntryInfoClick(entry)}
                                            />
                                            <Divider />
                                        </Fragment>
                                    ))}
                                </Fragment>
                            )}
                        </Fragment>
                    ))}
                </>
            )}
        </ScrollList>
    );
}
