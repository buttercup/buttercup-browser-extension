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

class SearchResults extends Component {
    render() {
        return (
            <Container>
                <SearchResult />
                <SearchResult />
                <SearchResult />
                <SearchResult />
                <SearchResult />
            </Container>
        );
    }
}

export default SearchResults;
