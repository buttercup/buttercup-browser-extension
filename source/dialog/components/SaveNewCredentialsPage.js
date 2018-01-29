import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import LayoutMain from "./LayoutMain.js";

const FullSizeNotice = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

class SaveNewCredentialsPage extends Component {
    static propTypes = {
        credentialsTitle: PropTypes.string.isRequired
    };

    render() {
        return <LayoutMain>Hai</LayoutMain>;
    }
}

export default SaveNewCredentialsPage;
