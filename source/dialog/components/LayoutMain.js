import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;

class LayoutMain extends Component {
    render() {
        return <Container>{this.props.children}</Container>;
    }
}

export default LayoutMain;
