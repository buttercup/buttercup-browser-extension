import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import LayoutMain from "./LayoutMain.js";
import ArchiveTypeChooser from "../containers/ArchiveTypeChooser.js";

class AddArchivePage extends Component {
    render() {
        return (
            <LayoutMain title="Add Archive">
                <h3>Choose Archive Type</h3>
                <ArchiveTypeChooser />
            </LayoutMain>
        );
    }
}

export default AddArchivePage;
