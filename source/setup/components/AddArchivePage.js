import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import LayoutMain from "./LayoutMain.js";

class AddArchivePage extends Component {
    render() {
        return (
            <LayoutMain title="Add Archive">
                <h3>Choose Archive Type</h3>
            </LayoutMain>
        );
    }
}

export default AddArchivePage;
