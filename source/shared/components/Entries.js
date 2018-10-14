import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Divider } from "@blueprintjs/core";
import { EntriesShape } from "../prop-types/entry.js";
import Entry from "./Entry.js";

const Container = styled.div`
    overflow-x: hidden;
    overflow-y: scroll;
    flex: 1;
`;

const Entries = ({ entries, onSelectEntry, autoLoginEnabled = true }) => (
    <Container>
        <For each="entry" of={entries}>
            <Entry key={entry.id} entry={entry} onSelectEntry={onSelectEntry} autoLoginEnabled={autoLoginEnabled} />
            <Divider />
        </For>
    </Container>
);

Entries.propTypes = {
    entries: EntriesShape,
    sourcesUnlocked: PropTypes.number,
    autoLoginEnabled: PropTypes.bool,
    onSelectEntry: PropTypes.func.isRequired
};

export default Entries;
