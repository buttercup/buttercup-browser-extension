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

const Entries = ({ entries, onSelectEntry }) => (
    <Container>
        <For each="entry" of={entries}>
            <Entry key={entry.id} entry={entry} onSelectEntry={onSelectEntry} />
            <Divider />
        </For>
    </Container>
);

Entries.propTypes = {
    entries: EntriesShape,
    sourcesUnlocked: PropTypes.number.isRequired,
    onSelectEntry: PropTypes.func.isRequired
};

export default Entries;
