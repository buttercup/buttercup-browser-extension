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
const Spacer = styled.div`
    width: 100%;
    height: 30px;
`;

class AddArchivePage extends Component {
    static propTypes = {
        isConnected: PropTypes.bool.isRequired,
        isConnecting: PropTypes.bool.isRequired,
        onChooseWebDAVBasedArchive: PropTypes.func.isRequired,
        onConnectWebDAVBasedSource: PropTypes.func.isRequired,
        onCreateRemotePath: PropTypes.func.isRequired,
        onSelectRemotePath: PropTypes.func.isRequired,
        selectedArchiveType: PropTypes.string,
        selectedFilename: PropTypes.string,
        selectedFilenameNeedsCreation: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        // We store some details in the state, because they're sensitive. No point
        // storing them globally..
        this.state = {
            archiveName: "",
            masterPassword: "",
            remoteURL: "",
            remoteUsername: "",
            remotePassword: ""
        };
    }

    handleChooseWebDAVBasedFile(event) {
        event.preventDefault();
        // We send the remote credentials as these should never touch Redux
        this.props.onChooseWebDAVBasedArchive(
            this.props.selectedArchiveType,
            this.state.archiveName,
            this.state.masterPassword,
            this.state.remoteURL,
            this.state.remoteUsername,
            this.state.remotePassword
        );
    }

    handleConnectNextcloud(event) {
        event.preventDefault();
        this.props.onConnectWebDAVBasedSource(
            "nextcloud",
            this.state.remoteURL,
            this.state.remoteUsername,
            this.state.remotePassword
        );
    }

    handleConnectOwnCloud(event) {
        event.preventDefault();
        this.props.onConnectWebDAVBasedSource(
            "owncloud",
            this.state.remoteURL,
            this.state.remoteUsername,
            this.state.remotePassword
        );
    }

    handleConnectWebDAV(event) {
        event.preventDefault();
        this.props.onConnectWebDAVBasedSource(
            "webdav",
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
        const canShowWebDAVExplorer = ["webdav", "owncloud", "nextcloud"].includes(this.props.selectedArchiveType);
        return (
            <LayoutMain title="Add Archive">
                <h3>Choose Archive Type</h3>
                <ArchiveTypeChooser disabled={this.props.isConnecting || this.props.isConnected} />
                <If condition={this.props.selectedArchiveType}>{this.renderConnectionInfo()}</If>
                <If condition={this.props.isConnecting}>
                    <LoaderContainer>
                        <Spinner color="rgba(0, 183, 172, 1)" name="ball-grid-pulse" />
                    </LoaderContainer>
                </If>
                <If condition={canShowWebDAVExplorer && this.props.isConnected}>
                    <h3>Choose or Create Archive</h3>
                    <WebDAVExplorer
                        onCreateRemotePath={path => this.props.onCreateRemotePath(path)}
                        onSelectRemotePath={path => this.props.onSelectRemotePath(path)}
                        selectedFilename={this.props.selectedFilename}
                        selectedFilenameNeedsCreation={this.props.selectedFilenameNeedsCreation}
                    />
                    <If condition={this.props.selectedFilename}>{this.renderArchiveNameInput()}</If>
                </If>
            </LayoutMain>
        );
    }

    renderArchiveNameInput() {
        return (
            <SubSection key="archiveNameInput">
                <h3>Enter Archive Name</h3>
                <FormContainer>
                    <FormRow>
                        <FormLegendItem>Name</FormLegendItem>
                        <FormInputItem>
                            <ButtercupInput
                                placeholder="Enter archive name..."
                                onChange={event => this.handleUpdateForm("archiveName", event)}
                                value={this.state.archiveName}
                            />
                        </FormInputItem>
                    </FormRow>
                    <FormRow>
                        <FormLegendItem>Master Password</FormLegendItem>
                        <FormInputItem>
                            <ButtercupInput
                                placeholder="Enter archive password..."
                                onChange={event => this.handleUpdateForm("masterPassword", event)}
                                type="password"
                                value={this.state.masterPassword}
                            />
                        </FormInputItem>
                    </FormRow>
                </FormContainer>
                <ButtonContainer>
                    <ButtercupButton onClick={event => this.handleChooseWebDAVBasedFile(event)}>
                        Save Archive
                    </ButtercupButton>
                </ButtonContainer>
                <Spacer />
            </SubSection>
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
                    <When condition={this.props.selectedArchiveType === "owncloud"}>
                        <FormContainer>
                            <FormRow>
                                <FormLegendItem>ownCloud URL</FormLegendItem>
                                <FormInputItem>
                                    <ButtercupInput
                                        placeholder="Enter ownCloud URL..."
                                        disabled={connectionOptionsDisabled}
                                        onChange={event => this.handleUpdateForm("remoteURL", event)}
                                        value={this.state.remoteURL}
                                    />
                                </FormInputItem>
                            </FormRow>
                            <FormRow>
                                <FormLegendItem>ownCloud Username</FormLegendItem>
                                <FormInputItem>
                                    <ButtercupInput
                                        placeholder="Enter ownCloud username..."
                                        disabled={connectionOptionsDisabled}
                                        onChange={event => this.handleUpdateForm("remoteUsername", event)}
                                        value={this.state.remoteUsername}
                                    />
                                </FormInputItem>
                            </FormRow>
                            <FormRow>
                                <FormLegendItem>ownCloud Password</FormLegendItem>
                                <FormInputItem>
                                    <ButtercupInput
                                        placeholder="Enter ownCloud password..."
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
                                onClick={event => this.handleConnectOwnCloud(event)}
                                disabled={connectionOptionsDisabled}
                            >
                                Connect
                            </ButtercupButton>
                        </ButtonContainer>
                    </When>
                    <When condition={this.props.selectedArchiveType === "nextcloud"}>
                        <FormContainer>
                            <FormRow>
                                <FormLegendItem>Nextcloud URL</FormLegendItem>
                                <FormInputItem>
                                    <ButtercupInput
                                        placeholder="Enter Nextcloud URL..."
                                        disabled={connectionOptionsDisabled}
                                        onChange={event => this.handleUpdateForm("remoteURL", event)}
                                        value={this.state.remoteURL}
                                    />
                                </FormInputItem>
                            </FormRow>
                            <FormRow>
                                <FormLegendItem>Nextcloud Username</FormLegendItem>
                                <FormInputItem>
                                    <ButtercupInput
                                        placeholder="Enter Nextcloud username..."
                                        disabled={connectionOptionsDisabled}
                                        onChange={event => this.handleUpdateForm("remoteUsername", event)}
                                        value={this.state.remoteUsername}
                                    />
                                </FormInputItem>
                            </FormRow>
                            <FormRow>
                                <FormLegendItem>Nextcloud Password</FormLegendItem>
                                <FormInputItem>
                                    <ButtercupInput
                                        placeholder="Enter Nextcloud password..."
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
                                onClick={event => this.handleConnectNextcloud(event)}
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
