import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Spinner, Intent, Classes } from "@blueprintjs/core";

const Overlay = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    right: 0px;
    bottom: 0px;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 50;
`;
const LoadingText = styled.div`
    font-size: 1.2rem;
    color: #fff;
    margin-top: 1rem;
`;

class LoadingModal extends PureComponent {
    static propTypes = {
        busy: PropTypes.bool.isRequired,
        busyMessage: PropTypes.string.isRequired
    };

    render() {
        if (this.props.busy !== true) {
            return null;
        }
        return (
            <Overlay>
                <Spinner size={64} intent={Intent.SUCCESS} />
                <LoadingText>{this.props.busyMessage}</LoadingText>
            </Overlay>
        );
    }
}

export default LoadingModal;
