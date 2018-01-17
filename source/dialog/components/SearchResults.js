import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import SearchResult from "../containers/SearchResult.js";

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow-x: hidden;
    overflow-y: scroll;
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
                <For each="entry" of={this.props.entries}>
                    <SearchResult key={entry.id} sourceID={entry.sourceID} entryID={entry.id} />
                </For>
            </Container>
        );
    }
}

export default SearchResults;
