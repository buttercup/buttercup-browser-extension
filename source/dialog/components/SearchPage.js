import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import LayoutMain from "./LayoutMain.js";
import SearchBar from "../containers/SearchBar.js";

class SearchPage extends Component {
    render() {
        return (
            <LayoutMain>
                <SearchBar />
            </LayoutMain>
        );
    }
}

export default SearchPage;
