import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import LayoutMain from "./LayoutMain.js";
import SearchBar from "../containers/SearchBar.js";
import SearchResults from "../containers/SearchResults.js";

class SearchPage extends Component {
    render() {
        return (
            <LayoutMain>
                <SearchBar />
                <SearchResults />
            </LayoutMain>
        );
    }
}

export default SearchPage;
