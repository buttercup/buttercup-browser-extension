import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Card, Button, H3, H4, FormGroup, InputGroup, Intent } from "@blueprintjs/core";
import uuid from "uuid/v4";
import { Input as ButtercupInput, Button as ButtercupButton } from "@buttercup/ui";
import LayoutMain from "./LayoutMain.js";
import ArchiveTypeChooser from "../containers/ArchiveTypeChooser.js";
import { ARCHIVE_TYPES } from "./ArchiveTypeChooser.js";
import RemoteExplorer from "../containers/RemoteExplorer.js";
import { FormButtonContainer, FormContainer, FormLegendItem, FormRow, FormInputItem } from "./forms.js";

const SubSection = styled.div`
    width: 100%;
    margin-top: 30px;
`;
const Spacer = styled.div`
    width: 100%;
    height: 2rem;
`;
const SplitView = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
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

    handleConnectWebDAV(event) {
        event.preventDefault();
        this.props.onConnectWebDAVBasedSource(
            this.props.selectedArchiveType,
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
        const isTargetingWebDAV = ["webdav", "owncloud", "nextcloud"].includes(this.props.selectedArchiveType);
        const isTargetingDropbox = this.props.selectedArchiveType === "dropbox";
        const hasAuthenticatedDropbox = typeof this.props.dropboxAuthToken === "string";
        const hasAuthenticated =
            (isTargetingWebDAV && this.props.isConnected) || (isTargetingDropbox && hasAuthenticatedDropbox);
        return (
            <LayoutMain title="Add Archive">
                <H4>Choose Vault Type</H4>
                <ArchiveTypeChooser disabled={hasAuthenticated} />
                <Spacer />
                <If condition={this.props.selectedArchiveType}>
                    <Choose>
                        <When condition={hasAuthenticated}>
                            <H4>Choose or Create Vault</H4>
                            <SplitView>
                                <Card>
                                    <RemoteExplorer
                                        onCreateRemotePath={path => this.props.onCreateRemotePath(path)}
                                        onSelectRemotePath={path => this.props.onSelectRemotePath(path)}
                                        selectedFilename={this.props.selectedFilename}
                                        selectedFilenameNeedsCreation={this.props.selectedFilenameNeedsCreation}
                                        fetchType={isTargetingWebDAV ? "webdav" : "dropbox"}
                                    />
                                </Card>
                                <Card>{this.renderArchiveNameInput()}</Card>
                            </SplitView>
                        </When>
                        <Otherwise>{this.renderConnectionInfo()}</Otherwise>
                    </Choose>
                </If>
            </LayoutMain>
        );
    }

    renderArchiveNameInput() {
        const { selectedFilename } = this.props;
        const disabled = !selectedFilename;
        return (
            <Fragment>
                <FormGroup full label="Name" labelInfo="(required)" disabled={disabled}>
                    <InputGroup
                        leftIcon="tag"
                        disabled={disabled}
                        placeholder="Enter vault name..."
                        onChange={event => this.handleUpdateForm("archiveName", event)}
                        value={this.state.archiveName}
                    />
                </FormGroup>
                <FormGroup full label="Master Password" labelInfo="(required)" disabled={disabled}>
                    <InputGroup
                        leftIcon="lock"
                        disabled={disabled}
                        placeholder="Enter vault password..."
                        type="password"
                        onChange={event => this.handleUpdateForm("masterPassword", event)}
                        value={this.state.masterPassword}
                    />
                </FormGroup>
                <Button
                    fill
                    disabled={disabled}
                    onClick={event =>
                        this.props.selectedArchiveType === "dropbox"
                            ? this.handleChooseDropboxBasedFile(event)
                            : this.handleChooseWebDAVBasedFile(event)
                    }
                >
                    Save Vault
                </Button>
            </Fragment>
        );
    }

    renderConnectionInfo() {
        const connectionOptionsDisabled = this.props.isConnecting || this.props.isConnected;
        const sectionTitle =
            this.props.selectedArchiveType === "dropbox" ? "Authenticate Cloud Source" : "Enter Connection Details";
        const isAuthenticatingDropbox = this.props.dropboxAuthID === this.state.dropboxAuthenticationID;
        const hasAuthenticatedDropbox = isAuthenticatingDropbox && this.props.dropboxAuthToken;
        const isWebDAV = ["webdav", "owncloud", "nextcloud"].includes(this.props.selectedArchiveType);
        const title = ARCHIVE_TYPES.find(archiveType => archiveType.type === this.props.selectedArchiveType).title;
        return (
            <SubSection>
                <H4>{sectionTitle}</H4>
                <Choose>
                    <When condition={isWebDAV}>
                        <Card>
                            <FormGroup full label={`${title} URL`} labelInfo="(required)">
                                <InputGroup
                                    leftIcon="globe"
                                    placeholder="Enter remote URL..."
                                    disabled={connectionOptionsDisabled}
                                    onChange={event => this.handleUpdateForm("remoteURL", event)}
                                    value={this.state.remoteURL}
                                />
                            </FormGroup>
                            <FormGroup full label={`${title} Username`} labelInfo="(required)">
                                <InputGroup
                                    leftIcon="user"
                                    placeholder={`Enter ${title} username...`}
                                    disabled={connectionOptionsDisabled}
                                    onChange={event => this.handleUpdateForm("remoteUsername", event)}
                                    value={this.state.remoteUsername}
                                />
                            </FormGroup>
                            <FormGroup full label={`${title} Password`} labelInfo="(required)">
                                <InputGroup
                                    leftIcon="key"
                                    placeholder={`Enter ${title} password...`}
                                    type="password"
                                    disabled={connectionOptionsDisabled}
                                    onChange={event => this.handleUpdateForm("remotePassword", event)}
                                    value={this.state.remotePassword}
                                />
                            </FormGroup>
                            <Button
                                intent={Intent.SUCCESS}
                                onClick={::this.handleConnectWebDAV}
                                loading={this.props.isConnecting}
                                disabled={this.props.isConnected}
                            >
                                Connect
                            </Button>
                        </Card>
                    </When>
                    <When condition={this.props.selectedArchiveType === "dropbox"}>
                        <Card>
                            <H4>Dropbox</H4>
                            <p>
                                To start, please grant Buttercup access to your Dropbox account. This access will be
                                only used to store and read a Buttercup Vault that you choose or create.
                            </p>
                            <Button
                                icon="key"
                                onClick={::this.handleDropboxAuth}
                                disabled={hasAuthenticatedDropbox}
                                loading={isAuthenticatingDropbox && !hasAuthenticatedDropbox}
                            >
                                Grant Dropbox Access
                            </Button>
                        </Card>
                    </When>
                    <Otherwise>
                        <i>Unsupported vault type.</i>
                    </Otherwise>
                </Choose>
            </SubSection>
        );
    }
}

export default AddArchivePage;
