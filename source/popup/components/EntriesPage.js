import React, { Component } from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import styled from "styled-components";
import HeaderBar from "../containers/HeaderBar.js";
import SearchBar from "../containers/SearchBar.js";
import SearchResults from "../containers/SearchResults.js";

let __clearedButtercupSearchResults = false;

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
    static propTypes = {
        onPrepare: PropTypes.func.isRequired
    };

    componentWillMount() {
        if (!__clearedButtercupSearchResults) {
            this.props.onPrepare();
            __clearedButtercupSearchResults = true;
        }
    }

    render() {
        return (
            <Container>
                <SearchBar />
                <SearchResults />
            </Container>
        );
    }
}

export default EntriesPage;
