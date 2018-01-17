import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Spinner from "react-spinkit";
import LayoutMain from "./LayoutMain.js";
import ArchivesList from "../containers/ArchivesList.js";

const ArchivesContainer = styled.div`
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;
const LoadingContainer = styled.div`
    margin-top: 30px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const LockingText = styled.div`
    font-size: 18px;
    color: rgb(20, 20, 20);
    margin-top: 16px;
`;

class ArchivesLockPage extends Component {
    static propTypes = {
        onReadyToLock: PropTypes.func.isRequired
    };

    componentDidMount() {
        setTimeout(() => {
            this.props.onReadyToLock();
        }, 300);
    }

    render() {
        return (
            <LayoutMain title="Lock Archives">
                <LoadingContainer>
                    <Spinner color="rgba(0, 183, 172, 1)" name="ball-grid-pulse" />
                    <LockingText>Locking archives...</LockingText>
                </LoadingContainer>
                <ArchivesContainer>
                    <ArchivesList />
                </ArchivesContainer>
            </LayoutMain>
        );
    }
}

export default ArchivesLockPage;
