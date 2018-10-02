import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Card, Button, H3, H4, FormGroup, InputGroup, Intent } from "@blueprintjs/core";
import uuid from "uuid/v4";
import { Input as ButtercupInput, Button as ButtercupButton } from "@buttercup/ui";
import Spinner from "react-spinkit";
import LayoutMain from "./LayoutMain.js";
import ArchiveTypeChooser from "../containers/ArchiveTypeChooser.js";
import RemoteExplorer from "../containers/RemoteExplorer.js";
import { FormButtonContainer, FormContainer, FormLegendItem, FormRow, FormInputItem } from "./forms.js";

const SubSection = styled.div`
    width: 100%;
    margin-top: 30px;
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

class AddArchivePage extends PureComponent {
    static propTypes = {
        dropboxAuthID: PropTypes.string,
        dropboxAuthToken: PropTypes.string,
        isConnected: PropTypes.bool.isRequired,
        isConnecting: PropTypes.bool.isRequired,
        onAuthenticateDropbox: PropTypes.func.isRequired,
        onChooseDropboxBasedArchive: PropTypes.func.isRequired,
        onChooseWebDAVBasedArchive: PropTypes.func.isRequired,
        onConnectWebDAVBasedSource: PropTypes.func.isRequired,
        onCreateRemotePath: PropTypes.func.isRequired,
        onSelectRemotePath: PropTypes.func.isRequired,
        selectedArchiveType: PropTypes.string,
        selectedFilename: PropTypes.string,
        selectedFilenameNeedsCreation: PropTypes.bool.isRequired
    };

    // We store some details in the state, because they're sensitive. No point
    // storing them globally..
    state = {
        archiveName: "",
        dropboxAuthenticationID: "",
        masterPassword: "",
        remoteURL: "",
        remoteUsername: "",
        remotePassword: ""
    };

    componentDidMount() {
        this.setState({
            dropboxAuthenticationID: uuid()
        });
    }

    handleDropboxAuth(event) {
        event.preventDefault();
        this.props.onAuthenticateDropbox(this.state.dropboxAuthenticationID);
    }

    handleChooseDropboxBasedFile(event) {
        event.preventDefault();
        // We send the remote credentials as these should never touch Redux
        this.props.onChooseDropboxBasedArchive(this.state.archiveName, this.state.masterPassword);
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
        const isTargetingDropbox = this.props.selectedArchiveType === "dropbox";
        const hasAuthenticatedDropbox =
            this.props.dropboxAuthID === this.state.dropboxAuthenticationID && this.props.dropboxAuthToken;
        return (
            <LayoutMain title="Add Archive">
                <H4>Choose Archive Type</H4>
                <ArchiveTypeChooser disabled={this.props.isConnecting || this.props.isConnected} />

                <If condition={this.props.selectedArchiveType}>{this.renderConnectionInfo()}</If>
                <If condition={this.props.isConnecting}>
                    <LoaderContainer>
                        <Spinner color="rgba(0, 183, 172, 1)" name="ball-grid-pulse" />
                    </LoaderContainer>
                </If>
                <If condition={canShowWebDAVExplorer && this.props.isConnected}>
                    <H4>Choose or Create Archive</H4>
                    <RemoteExplorer
                        onCreateRemotePath={path => this.props.onCreateRemotePath(path)}
                        onSelectRemotePath={path => this.props.onSelectRemotePath(path)}
                        selectedFilename={this.props.selectedFilename}
                        selectedFilenameNeedsCreation={this.props.selectedFilenameNeedsCreation}
                        fetchType="webdav"
                    />
                    <If condition={this.props.selectedFilename}>{this.renderArchiveNameInput()}</If>
                </If>
                <If condition={isTargetingDropbox && hasAuthenticatedDropbox}>
                    <H4>Choose or Create Archive</H4>
                    <RemoteExplorer
                        onCreateRemotePath={path => this.props.onCreateRemotePath(path)}
                        onSelectRemotePath={path => this.props.onSelectRemotePath(path)}
                        selectedFilename={this.props.selectedFilename}
                        selectedFilenameNeedsCreation={this.props.selectedFilenameNeedsCreation}
                        fetchType="dropbox"
                    />
                    <If condition={this.props.selectedFilename}>{this.renderArchiveNameInput()}</If>
                </If>
            </LayoutMain>
        );
    }

    renderArchiveNameInput() {
        return (
            <SubSection key="archiveNameInput">
                <H4>Enter Archive Name</H4>
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
                <FormButtonContainer>
                    <Choose>
                        <When condition={this.props.selectedArchiveType === "dropbox"}>
                            <ButtercupButton onClick={event => this.handleChooseDropboxBasedFile(event)}>
                                Save Archive
                            </ButtercupButton>
                        </When>
                        <Otherwise>
                            <ButtercupButton onClick={event => this.handleChooseWebDAVBasedFile(event)}>
                                Save Archive
                            </ButtercupButton>
                        </Otherwise>
                    </Choose>
                </FormButtonContainer>
                <Spacer />
            </SubSection>
        );
    }

    renderConnectionInfo() {
        const connectionOptionsDisabled = this.props.isConnecting || this.props.isConnected;
        const title =
            this.props.selectedArchiveType === "dropbox" ? "Authenticate Cloud Source" : "Enter Connection Details";
        const isAuthenticatingDropbox = this.props.dropboxAuthID === this.state.dropboxAuthenticationID;
        return (
            <SubSection>
                <H4>{title}</H4>
                <Choose>
                    <When condition={this.props.selectedArchiveType === "webdav"}>
                        <Card>
                            <FormGroup full label="WebDAV URL" labelInfo="(required)">
                                <InputGroup
                                    leftIcon="globe"
                                    placeholder="Enter remote URL..."
                                    disabled={connectionOptionsDisabled}
                                    onChange={event => this.handleUpdateForm("remoteURL", event)}
                                    value={this.state.remoteURL}
                                />
                            </FormGroup>
                            <FormGroup full label="WebDAV Username" labelInfo="(required)">
                                <InputGroup
                                    leftIcon="user"
                                    placeholder="Enter WebDAV username..."
                                    disabled={connectionOptionsDisabled}
                                    onChange={event => this.handleUpdateForm("remoteUsername", event)}
                                    value={this.state.remoteUsername}
                                />
                            </FormGroup>
                            <FormGroup full label="WebDAV Password" labelInfo="(required)">
                                <InputGroup
                                    leftIcon="key"
                                    placeholder="Enter WebDAV password..."
                                    type="password"
                                    disabled={connectionOptionsDisabled}
                                    onChange={event => this.handleUpdateForm("remotePassword", event)}
                                    value={this.state.remotePassword}
                                />
                            </FormGroup>
                            <Button
                                intent={Intent.SUCCESS}
                                onClick={::this.handleConnectWebDAV}
                                loading={connectionOptionsDisabled}
                            >
                                Connect
                            </Button>
                        </Card>
                        <FormButtonContainer />
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
                        <FormButtonContainer>
                            <ButtercupButton
                                onClick={::this.handleConnectOwnCloud}
                                disabled={connectionOptionsDisabled}
                            >
                                Connect
                            </ButtercupButton>
                        </FormButtonContainer>
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
                        <FormButtonContainer>
                            <ButtercupButton
                                onClick={::this.handleConnectNextcloud}
                                disabled={connectionOptionsDisabled}
                            >
                                Connect
                            </ButtercupButton>
                        </FormButtonContainer>
                    </When>
                    <When condition={this.props.selectedArchiveType === "dropbox"}>
                        <Card>
                            <H4>Dropbox</H4>
                            <p>
                                To start, please grant Buttercup access to your Dropbox account. This access will be
                                only used to store and read a Buttercup Vault that you choose or create.
                            </p>
                            <Button icon="key" onClick={::this.handleDropboxAuth} disabled={isAuthenticatingDropbox}>
                                Grant Dropbox Access
                            </Button>
                        </Card>
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
