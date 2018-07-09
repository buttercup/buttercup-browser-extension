import React, { Component } from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import styled from "styled-components";
import HeaderBar from "../containers/HeaderBar.js";
// import SearchPage from "../../shared/containers/SearchPage.js";

const Container = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

class EntriesPage extends Component {
    static propTypes = {};

    render() {
        return (
            <Container>
                <HeaderBar current="entries" />
            </Container>
        );
    }
}

export default EntriesPage;
