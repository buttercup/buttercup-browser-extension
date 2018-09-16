import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import styled from "styled-components";
import { InputGroup } from "@blueprintjs/core";
import SearchResults from "../containers/SearchResults.js";

let __clearedButtercupSearchResults = false;

const SearchInputWrapper = styled.div`
    flex: 0;
    margin-bottom: 0.5rem;
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

    handleSearchTermChange(event) {
        const value = event.target.value;
        this.props.onSearchTermChange(value);
    }

    render() {
        return (
            <Fragment>
                <SearchInputWrapper>
                    <InputGroup
                        placeholder="Search for entries..."
                        className="bp3-fill"
                        type="search"
                        leftIcon="search"
                        onChange={::this.handleSearchTermChange}
                    />
                </SearchInputWrapper>
                <SearchResults />
            </Fragment>
        );
    }
}

export default EntriesPage;
