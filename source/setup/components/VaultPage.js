import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { Button, Intent, Classes, FormGroup, InputGroup, Toaster, Position } from "@blueprintjs/core";
import Dialog from "./Dialog.js";
import { closeCurrentTab } from "../../shared/library/extension.js";
import VaultEditor from "../containers/VaultEditor.js";

class VaultPage extends PureComponent {
    static propTypes = {
        archiveTitle: PropTypes.string.isRequired,
        isEditing: PropTypes.bool.isRequired,
        onLockArchive: PropTypes.func.isRequired,
        onRemoveArchive: PropTypes.func.isRequired,
        onUnlockArchive: PropTypes.func.isRequired,
        sourceID: PropTypes.string.isRequired,
        state: PropTypes.oneOf(["locked", "unlocked"]).isRequired
    };

    // We store some details in the state, because they're sensitive:
    state = {
        masterPassword: ""
    };

    componentDidMount() {
        if (this._passwordInput) {
            this._passwordInput.focus();
        }
    }

    handleCancelUnlock(event) {
        event.preventDefault();
        closeCurrentTab();
    }

    handleLockArchive(event) {
        event.preventDefault();
        this.props.onLockArchive(this.props.sourceID);
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
        const actions = (
            <Fragment>
                <Button
                    className="ml-0"
                    intent={Intent.DANGER}
                    icon="trash"
                    onClick={::this.handleRemoveArchive}
                    disabled={disableForm}
                >
                    Remove Archive
                </Button>
                <Button className="ml-auto" onClick={::this.handleCancelUnlock} disabled={disableForm}>
                    Cancel
                </Button>
                <Choose>
                    <When condition={this.props.state === "locked"}>
                        <Button onClick={::this.handleUnlockArchive} disabled={disableForm}>
                            Unlock
                        </Button>
                    </When>
                    <Otherwise>
                        <Button icon="lock" onClick={::this.handleLockArchive} disabled={disableForm}>
                            Lock
                        </Button>
                    </Otherwise>
                </Choose>
            </Fragment>
        );
        return (
            <Dialog
                maximise={this.props.state === "unlocked"}
                title={`${title}: ${this.props.archiveTitle}`}
                actions={actions}
            >
                <If condition={this.props.state === "unlocked"}>
                    <VaultEditor sourceID={this.props.sourceID} />
                </If>
                <If condition={this.props.state === "locked"}>
                    <form onSubmit={::this.handleUnlockArchive}>
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
            </Dialog>
        );
    }
}

export default VaultPage;
