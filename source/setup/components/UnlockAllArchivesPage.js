import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Input as ButtercupInput, Button as ButtercupButton } from "@buttercup/ui";
import LayoutMain from "./LayoutMain.js";
import { closeCurrentTab } from "../../shared/library/extension.js";

const PasswordRow = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 30px;
`;
const PasswordLabel = styled.label`
    margin-right: 6px;
`;
const ButtonsRow = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;

    > * {
        margin-left: 12px;
    }
`;

class UnlockAllArchivesPage extends Component {
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
        setTimeout(() => {
            this._passwordInput.focus();
        }, 100);
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

    onInputKeyPress(event) {
        if (event.key === "Enter") {
            this.props.onUnlockArchive(this.props.sourceID, this.state.masterPassword);
        }
    }

    render() {
        const disableForm = this.props.isEditing;
        let title, action;
        switch (this.props.state) {
            case "locked":
                title = "Unlock Archive";
                action = "Unlock";
                break;
            case "unlocked":
                title = "Manage Archive";
                action = "Manage";
                break;
            default:
                throw new Error(`Unknown archive state: ${this.props.state}`);
        }
        return (
            <LayoutMain title={title}>
                <h3>
                    {action} '{this.props.archiveTitle}'
                </h3>
                <PasswordRow>
                    <PasswordLabel>Password:</PasswordLabel>
                    <ButtercupInput
                        placeholder="Enter master password..."
                        type="password"
                        disabled={disableForm}
                        onChange={event => this.handleUpdateForm("masterPassword", event)}
                        value={this.state.masterPassword}
                        onKeyPress={::this.onInputKeyPress}
                        innerRef={input => {
                            this._passwordInput = input;
                        }}
                    />
                </PasswordRow>
                <ButtonsRow>
                    <ButtercupButton onClick={::this.handleUnlockArchive} disabled={disableForm}>
                        Unlock
                    </ButtercupButton>
                </ButtonsRow>
            </LayoutMain>
        );
    }
}

export default UnlockAllArchivesPage;
