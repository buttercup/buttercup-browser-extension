import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { InputGroup } from "@blueprintjs/core";
import styled from "styled-components";

const SEARCH_ICON = require("../../../resources/search-icon.png");

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 0.5rem;
`;

class SearchBar extends PureComponent {
    static propTypes = {
        onSearchTermChange: PropTypes.func.isRequired
    };

    handleSearchTermChange(event) {
        const value = event.target.value;
        this.props.onSearchTermChange(value);
    }

    render() {
        return (
            <Container>
                <InputGroup
                    placeholder="Search for entries..."
                    className="bp3-fill"
                    type="search"
                    leftIcon="search"
                    onChange={::this.handleSearchTermChange}
                />
            </Container>
        );
    }
}

export default SearchBar;
