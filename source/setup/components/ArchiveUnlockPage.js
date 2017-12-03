import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Input as ButtercupInput, Button as ButtercupButton } from "@buttercup/ui";
import Spinner from "react-spinkit";
import LayoutMain from "./LayoutMain.js";

class ArchiveUnlockPage extends Component {
    static propTypes = {
        archiveTitle: PropTypes.string.isRequired
    };

    render() {
        return (
            <LayoutMain title="Unlock Archive">
                <h3>Unlock '{this.props.archiveTitle}'</h3>
            </LayoutMain>
        );
    }
}

export default ArchiveUnlockPage;
