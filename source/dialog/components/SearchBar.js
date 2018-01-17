import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const BUTTERCUP_ICON = require("../../../resources/buttercup-128.png");
const SEARCH_ICON = require("../../../resources/search-icon.png");

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 3px outset rgba(255, 255, 255, 0.3);
`;
const ButtercupIcon = styled.img`
    margin: 4px;
    width: 32px;
    height: 32px;
`;
const SearchInput = styled.input`
    flex-grow: 2;
    border: 0;
    color: #fff;
    height: 36px;
    margin: 0px;
    background-color: rgba(0, 0, 0, 0);
    font-size: 16px;
    padding-left: 26px;
    outline: none;
    background: url(${SEARCH_ICON});
    background-repeat: no-repeat;
    background-position: 6px 50%;
    background-size: 14px 14px;
`;

class SearchBar extends Component {
    static propTypes = {
        onSearchTermChange: PropTypes.func.isRequired
    };

    state = {
        searchTerm: ""
    };

    componentDidMount() {
        setTimeout(() => {
            this._input.focus();
        }, 250);
    }

    handleSearchTermChange(event) {
        const value = event.target.value;
        this.setState({
            searchTerm: value
        });
        this.props.onSearchTermChange(value);
    }

    render() {
        return (
            <Container>
                <ButtercupIcon src={BUTTERCUP_ICON} />
                <SearchInput
                    type="text"
                    placeholder="Search for entries..."
                    value={this.state.searchTerm}
                    onChange={::this.handleSearchTermChange}
                    innerRef={input => {
                        this._input = input;
                    }}
                />
            </Container>
        );
    }
}

export default SearchBar;
