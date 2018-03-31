import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
`;

class LayoutMain extends Component {
    render() {
        return <Container className={this.props.className}>{this.props.children}</Container>;
    }
}

export default LayoutMain;
