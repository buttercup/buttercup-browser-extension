import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Spinner from "react-spinkit";

const Overlay = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    right: 0px;
    bottom: 0px;
    background-color: rgba(0, 0, 0, 0.8);
    display: ${props => (props.show ? "flex" : "none")};
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 2;
`;
const LoadingText = styled.div`
    font-size: 18px;
    color: #fff;
    margin-top: 18px;
`;

class LoadingModal extends Component {
    static propTypes = {
        busy: PropTypes.bool.isRequired,
        busyMessage: PropTypes.string.isRequired
    };

    render() {
        return (
            <Overlay show={this.props.busy}>
                <Spinner color="rgba(0, 183, 172, 1)" name="ball-grid-pulse" />
                <LoadingText>{this.props.busyMessage}</LoadingText>
            </Overlay>
        );
    }
}

export default LoadingModal;
