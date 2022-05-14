import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { Button, Intent, FormGroup, InputGroup, Navbar, Alignment } from "@blueprintjs/core";
import styled from "styled-components";
import Dialog from "./Dialog.js";
import { closeCurrentTab } from "../../shared/library/extension.js";
import VaultEditor from "../containers/VaultEditor.js";

const CLEAR_PASSWORD_CHANGE = {
    oldMasterPassword: "",
    newMasterPassword: "",
    newMasterPassword2: ""
};

const VaultContainer = styled.div`
    height: calc(100% - 0px);
    margin-top: 0px;
`;

class VaultPage extends PureComponent {
    static propTypes = {
        attachments: PropTypes.bool.isRequired,
        archiveTitle: PropTypes.string.isRequired,
        archiveType: PropTypes.string,
        changePassword: PropTypes.func.isRequired,
        isEditing: PropTypes.bool.isRequired,
        onLockArchive: PropTypes.func.isRequired,
        onRemoveArchive: PropTypes.func.isRequired,
        onUnlockArchive: PropTypes.func.isRequired,
        sourceID: PropTypes.string.isRequired,
        state: PropTypes.oneOf(["locked", "unlocked"]).isRequired
    };

    state = {
        changingMasterPassword: false,
        masterPassword: "",
        passwordToken: "",
        oldMasterPassword: "",
        newMasterPassword: "",
        newMasterPassword2: ""
    };

    get passwordChangeValid() {
        return (
            this.state.oldMasterPassword &&
            this.state.newMasterPassword &&
            this.state.newMasterPassword === this.state.newMasterPassword2
        );
    }

    componentDidMount() {
        if (this._passwordInput) {
            this._passwordInput.focus();
        }
    }

    handleCloseTab(event) {
        event.preventDefault();
        closeCurrentTab();
    }

    handleLockArchive(event) {
        event.preventDefault();
        this.props.onLockArchive(this.props.sourceID);
    }

    handlePasswordChange(event) {
        event.preventDefault();
        this.setState({
            changingMasterPassword: true,
            ...CLEAR_PASSWORD_CHANGE
        });
    }

    handlePasswordChangeSubmit(event) {
        event.preventDefault();
        this.props.changePassword(
            this.props.sourceID,
            this.state.oldMasterPassword,
            this.state.newMasterPassword,
            {
                passwordToken: this.state.passwordToken
            },
            () => {
                this.setState({
                    changingMasterPassword: false,
                    ...CLEAR_PASSWORD_CHANGE
                });
            }
        );
    }

    handleRemoveArchive(event) {
        event.preventDefault();
        this.props.onRemoveArchive(this.props.sourceID);
    }

    handleUnlockArchive(event) {
        event.preventDefault();
        this.props.onUnlockArchive(this.props.sourceID, this.state.masterPassword);
    }

    handleUpdateForm(property, event) {
        this.setState({
            [property]: event.target.value
        });
    }

    render() {
        const disableForm = this.props.isEditing;
        let title, action;
        switch (this.props.state) {
            case "locked":
                title = "Unlock Vault";
                action = "Unlock";
                break;
            case "unlocked":
                title = "Managing Vault";
                action = "Manage";
                break;
            default:
                throw new Error(`Unknown vault state: ${this.props.state}`);
        }
        return (
            <Fragment>
                <Navbar>
                    <Navbar.Group align={Alignment.LEFT}>
                        <Navbar.Heading>{this.props.archiveTitle}</Navbar.Heading>
                        <Navbar.Divider />
                        <Choose>
                            <When condition={this.props.state === "locked"}>
                                <Button
                                    className="bp4-minimal"
                                    onClick={event => this.handleUnlockArchive(event)}
                                    disabled={disableForm}
                                >
                                    Unlock
                                </Button>
                            </When>
                            <Otherwise>
                                <Button
                                    className="bp4-minimal"
                                    icon="lock"
                                    onClick={event => this.handleLockArchive(event)}
                                    disabled={disableForm}
                                >
                                    Lock
                                </Button>
                                <Button
                                    className="bp4-minimal"
                                    icon="text-highlight"
                                    onClick={event => this.handlePasswordChange(event)}
                                    disabled={disableForm}
                                >
                                    Change Password
                                </Button>
                            </Otherwise>
                        </Choose>
                    </Navbar.Group>
                    <Navbar.Group align={Alignment.RIGHT}>
                        <Button
                            className="bp4-minimal"
                            intent={Intent.DANGER}
                            icon="trash"
                            onClick={event => this.handleRemoveArchive(event)}
                            disabled={disableForm}
                            title="Remove vault"
                        />
                        <Button
                            className="bp4-minimal"
                            onClick={event => this.handleCloseTab(event)}
                            disabled={disableForm}
                            icon="cross"
                        />
                    </Navbar.Group>
                </Navbar>
                <VaultContainer>
                    <If condition={this.props.state === "unlocked"}>
                        <VaultEditor attachments={this.props.attachments} sourceID={this.props.sourceID} />
                    </If>
                    <If condition={this.props.state === "locked"}>
                        <form onSubmit={event => this.handleUnlockArchive(event)}>
                            <FormGroup disabled={disableForm} label="Master Password" labelFor="master-password">
                                <InputGroup
                                    id="master-password"
                                    type="password"
                                    placeholder="Enter your password..."
                                    disabled={disableForm}
                                    large
                                    onChange={event => this.handleUpdateForm("masterPassword", event)}
                                    inputRef={input => {
                                        this._passwordInput = input;
                                    }}
                                />
                            </FormGroup>
                        </form>
                    </If>
                </VaultContainer>
                <If condition={this.state.changingMasterPassword}>
                    <Dialog
                        title={`Change Password: ${this.props.archiveTitle}`}
                        actions={
                            <Fragment>
                                <Button
                                    onClick={() =>
                                        this.setState({ changingMasterPassword: false, ...CLEAR_PASSWORD_CHANGE })
                                    }
                                    disabled={disableForm}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    intent={Intent.DANGER}
                                    icon="confirm"
                                    onClick={event => this.handlePasswordChangeSubmit(event)}
                                    disabled={disableForm || !this.passwordChangeValid}
                                >
                                    Change Password
                                </Button>
                            </Fragment>
                        }
                        zIndex={2}
                    >
                        <form onSubmit={event => this.handlePasswordChangeSubmit(event)}>
                            <FormGroup disabled={disableForm} label="Current Password" labelFor="old-master-password">
                                <InputGroup
                                    id="old-master-password"
                                    type="password"
                                    placeholder="Enter your current password..."
                                    disabled={disableForm}
                                    large
                                    onChange={event => this.handleUpdateForm("oldMasterPassword", event)}
                                />
                            </FormGroup>
                            <If condition={this.props.archiveType === "mybuttercup"}>
                                <FormGroup
                                    disabled={disableForm}
                                    label="Password Reset Token"
                                    labelFor="password-token"
                                >
                                    <InputGroup
                                        id="password-token"
                                        type="text"
                                        placeholder="Enter password reset token..."
                                        disabled={disableForm}
                                        large
                                        onChange={event => this.handleUpdateForm("passwordToken", event)}
                                    />
                                </FormGroup>
                            </If>
                            <FormGroup disabled={disableForm} label="New Password" labelFor="new-master-password">
                                <InputGroup
                                    id="new-master-password"
                                    type="password"
                                    placeholder="Enter new password..."
                                    disabled={disableForm}
                                    large
                                    onChange={event => this.handleUpdateForm("newMasterPassword", event)}
                                />
                            </FormGroup>
                            <FormGroup
                                disabled={disableForm}
                                label="New Password (confirm)"
                                labelFor="new-master-password-2"
                            >
                                <InputGroup
                                    id="new-master-password-2"
                                    type="password"
                                    placeholder="Enter new password again..."
                                    disabled={disableForm}
                                    large
                                    onChange={event => this.handleUpdateForm("newMasterPassword2", event)}
                                />
                            </FormGroup>
                        </form>
                    </Dialog>
                </If>
            </Fragment>
        );
    }
}

export default VaultPage;
