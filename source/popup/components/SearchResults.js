import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { NonIdealState, Divider } from "@blueprintjs/core";
import SearchResult from "../containers/SearchResult.js";

const BUTTERCUP_LOGO = require("../../../resources/buttercup-standalone.png");

const Container = styled.div`
    overflow-x: hidden;
    overflow-y: scroll;
    flex: 1;
`;

const EntryShape = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string
});

class SearchResults extends Component {
    static propTypes = {
        entries: PropTypes.arrayOf(EntryShape),
        sourcesUnlocked: PropTypes.number.isRequired
    };

    render() {
        return (
            <Container>
                <Choose>
                    <When condition={this.props.entries.length > 0}>
                        <For each="entry" of={this.props.entries}>
                            <SearchResult key={entry.id} sourceID={entry.sourceID} entryID={entry.id} />
                            <Divider />
                        </For>
                    </When>
                    <Otherwise>
                        <NonIdealState
                            title="Welcome to Buttercup"
                            description="Use the search bar to find entries in your unlocked vaults."
                            icon={<img src={BUTTERCUP_LOGO} width="64" />}
                        />
                    </Otherwise>
                </Choose>
            </Container>
        );
    }
}

export default SearchResults;
