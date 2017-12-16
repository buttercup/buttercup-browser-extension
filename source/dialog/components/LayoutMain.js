import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
    background-color: red;
`;

class LayoutMain extends Component {
    render() {
        return <Container>{this.props.children}</Container>;
    }
}

export default LayoutMain;
