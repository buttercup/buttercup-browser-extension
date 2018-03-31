import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { GeneratorUserInterface } from "@buttercup/ui";
import LayoutMain from "./LayoutMain.js";

const Background = styled(LayoutMain)`
    background: #31353d;
    padding: 6px;
    width: calc(100% - 12px);
    height: calc(100% - 12px);
`;
const Generator = styled(GeneratorUserInterface)`
    width: 100%;
    height: 100%;
    border-radius: 0;

    pre,
    pre * {
        font-family: Courier, monospace;
    }
`;

class PasswordGeneratorPage extends Component {
    static propTypes = {
        onSetPassword: PropTypes.func.isRequired
    };

    render() {
        return (
            <Background>
                <Generator onGenerate={password => this.props.onSetPassword(password)} />
            </Background>
        );
    }
}

export default PasswordGeneratorPage;
