import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Colors, Classes } from "@blueprintjs/core";
import { GeneratorUserInterface } from "@buttercup/ui";
import DialogFrame from "./DialogFrame.js";

const Generator = styled(GeneratorUserInterface)`
    width: 100%;
    height: 100%;
    border-radius: 0;
    background-color: transparent;
    color: #000;
    padding: 0;

    pre {
        background-color: ${Colors.LIGHT_GRAY1};
        font-family: Courier, monospace;

        .num {
            color: ${Colors.GREEN1};
        }
    }
`;

class PasswordGeneratorPage extends Component {
    static propTypes = {
        onSetPassword: PropTypes.func.isRequired
    };

    render() {
        return (
            <DialogFrame className={Classes.UI_TEXT}>
                <Generator onGenerate={password => this.props.onSetPassword(password)} />
            </DialogFrame>
        );
    }
}

export default PasswordGeneratorPage;
