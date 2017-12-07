import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Input as ButtercupInput, Button as ButtercupButton } from "@buttercup/ui";
import Spinner from "react-spinkit";
import LayoutMain from "./LayoutMain.js";

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

class ArchiveUnlockPage extends Component {
    static propTypes = {
        archiveTitle: PropTypes.string.isRequired,
        isEditing: PropTypes.bool.isRequired,
        onRemoveArchive: PropTypes.func.isRequired,
        onUnlockArchive: PropTypes.func.isRequired,
        sourceID: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        // We store some details in the state, because they're sensitive:
        this.state = {
            masterPassword: ""
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this._passwordInput.focus();
        }, 100);
    }

    handleCancelUnlock(event) {
        event.preventDefault();
        window.close();
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

    onInputKeyPress(event) {
        if (event.key === "Enter") {
            this.props.onUnlockArchive(this.props.sourceID, this.state.masterPassword);
        }
    }

    render() {
        const disableForm = this.props.isEditing;
        return (
            <LayoutMain title="Unlock Archive">
                <h3>Unlock '{this.props.archiveTitle}'</h3>
                <PasswordRow>
                    <PasswordLabel>Password:</PasswordLabel>
                    <ButtercupInput
                        placeholder="Enter master password..."
                        type="password"
                        disabled={disableForm}
                        onChange={event => this.handleUpdateForm("masterPassword", event)}
                        value={this.state.masterPassword}
                        onKeyPress={event => this.onInputKeyPress(event)}
                        innerRef={input => {
                            this._passwordInput = input;
                        }}
                    />
                </PasswordRow>
                <ButtonsRow>
                    <ButtercupButton onClick={event => this.handleRemoveArchive(event)} disabled={disableForm}>
                        Remove Archive
                    </ButtercupButton>
                    <ButtercupButton onClick={event => this.handleCancelUnlock(event)} disabled={disableForm}>
                        Cancel
                    </ButtercupButton>
                    <ButtercupButton onClick={event => this.handleUnlockArchive(event)} disabled={disableForm}>
                        Unlock
                    </ButtercupButton>
                </ButtonsRow>
            </LayoutMain>
        );
    }
}

export default ArchiveUnlockPage;
