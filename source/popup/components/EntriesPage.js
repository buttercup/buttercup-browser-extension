import React, { Component } from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import styled from "styled-components";
import HeaderBar from "../containers/HeaderBar.js";
import SearchBar from "../containers/SearchBar.js";
import SearchResults from "../containers/SearchResults.js";

const Container = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
`;

class EntriesPage extends Component {
    static propTypes = {};

    render() {
        return (
            <Container>
                <HeaderBar current="entries" />
                <SearchBar />
                <SearchResults />
            </Container>
        );
    }
}

export default EntriesPage;
