import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { Button, Intent, Classes, FormGroup, InputGroup, Toaster, Position } from "@blueprintjs/core";
import Dialog from "./Dialog.js";
import VaultEditor from "../containers/VaultEditor.js";

class VaultPage extends PureComponent {
    static propTypes = {
        archiveTitle: PropTypes.string.isRequired,
        isEditing: PropTypes.bool.isRequired,
        onUnlockArchive: PropTypes.func.isRequired,
        sourceID: PropTypes.string.isRequired,
        state: PropTypes.oneOf(["unknown", "locked", "unlocked"]).isRequired
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
        if (this.props.state !== "unlocked") {
            return (
                <Dialog
                    title={`Unlock Vault: ${this.props.archiveTitle}`}
                    actions={
                        <Button onClick={::this.handleUnlockArchive} disabled={disableForm}>
                            Unlock
                        </Button>
                    }
                >
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
                </Dialog>
            );
        }
        return <VaultEditor sourceID={this.props.sourceID} />;
    }
}

export default VaultPage;
