import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Input as ButtercupInput, Button as ButtercupButton } from "@buttercup/ui";
import Spinner from "react-spinkit";
import LayoutMain from "./LayoutMain.js";
import ArchiveTypeChooser from "../containers/ArchiveTypeChooser.js";
import WebDAVExplorer from "../containers/WebDAVExplorer.js";

const SubSection = styled.div`
    width: 100%;
    margin-top: 30px;
`;
const FormContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;
const FormRow = styled.div`
    margin-left: 30px;
    width: calc(100% - 40px);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-content: stretch;
    align-items: center;
    height: 56px;
`;
const FormLegendItem = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 250px;
`;
const FormInputItem = styled.div`
    flex-grow: 2;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 10px;
    width: 100%;
    border-left: 1px solid #eee;
    height: 56px;
`;
const ButtonContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;
const LoaderContainer = styled.div`
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

class AddArchivePage extends Component {
    static propTypes = {
        isConnected: PropTypes.bool.isRequired,
        isConnecting: PropTypes.bool.isRequired,
        onConnectWebDAV: PropTypes.func.isRequired,
        selectedArchiveType: PropTypes.string
    };

    constructor(props) {
        super(props);
        // We store some details in the state, because they're sensitive. No point
        // storing them globally..
        this.state = {
            remoteURL: "",
            remoteUsername: "",
            remotePassword: ""
        };
    }

    handleConnectWebDAV(event) {
        event.preventDefault();
        this.props.onConnectWebDAV(
            this.state.remoteURL,
            this.state.remoteUsername,
            this.state.remotePassword
        );
    }

    handleUpdateForm(property, event) {
        this.setState({
            [property]: event.target.value
        });
    }

    render() {
        return (
            <LayoutMain title="Add Archive">
                <h3>Choose Archive Type</h3>
                <ArchiveTypeChooser />
                <If condition={this.props.selectedArchiveType}>
                    {this.renderConnectionInfo()}
                </If>
                <If condition={this.props.isConnecting}>
                    <LoaderContainer>
                        <Spinner color="rgba(0, 183, 172, 1)" name="ball-grid-pulse" />
                    </LoaderContainer>
                </If>
                <If condition={this.props.selectedArchiveType === "webdav" && this.props.isConnected}>
                    <h3>Choose or Create Archive</h3>
                    <WebDAVExplorer />
                </If>
            </LayoutMain>
        );
    }

    renderConnectionInfo() {
        const connectionOptionsDisabled = this.props.isConnecting || this.props.isConnected;
        return (
            <SubSection>
                <h3>Enter Connection Details</h3>
                <Choose>
                    <When condition={this.props.selectedArchiveType === "webdav"}>
                        <FormContainer>
                            <FormRow>
                                <FormLegendItem>WebDAV URL</FormLegendItem>
                                <FormInputItem>
                                    <ButtercupInput
                                        placeholder="Enter remote URL..."
                                        disabled={connectionOptionsDisabled}
                                        onChange={event => this.handleUpdateForm("remoteURL", event)}
                                        value={this.state.remoteURL}
                                    />
                                </FormInputItem>
                            </FormRow>
                            <FormRow>
                                <FormLegendItem>WebDAV Username</FormLegendItem>
                                <FormInputItem>
                                    <ButtercupInput
                                        placeholder="Enter WebDAV username..."
                                        disabled={connectionOptionsDisabled}
                                        onChange={event => this.handleUpdateForm("remoteUsername", event)}
                                        value={this.state.remoteUsername}
                                    />
                                </FormInputItem>
                            </FormRow>
                            <FormRow>
                                <FormLegendItem>WebDAV Password</FormLegendItem>
                                <FormInputItem>
                                    <ButtercupInput
                                        placeholder="Enter WebDAV password..."
                                        type="password"
                                        disabled={connectionOptionsDisabled}
                                        onChange={event => this.handleUpdateForm("remotePassword", event)}
                                        value={this.state.remotePassword}
                                    />
                                </FormInputItem>
                            </FormRow>
                        </FormContainer>
                        <ButtonContainer>
                            <ButtercupButton
                                onClick={event => this.handleConnectWebDAV(event)}
                                disabled={connectionOptionsDisabled}
                            >
                                Connect
                            </ButtercupButton>
                        </ButtonContainer>
                    </When>
                    <Otherwise>
                        <i>Unsupported archive type.</i>
                    </Otherwise>
                </Choose>
            </SubSection>
        );
    }
}

export default AddArchivePage;
