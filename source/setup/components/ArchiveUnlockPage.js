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
        return (
            <LayoutMain title="Unlock Archive">
                <h3>Unlock '{this.props.archiveTitle}'</h3>
                <PasswordRow>
                    <PasswordLabel>Password:</PasswordLabel>
                    <ButtercupInput
                        placeholder="Enter master password..."
                        type="password"
                        disabled={false}
                        onChange={event => this.handleUpdateForm("masterPassword", event)}
                        value={this.state.masterPassword}
                        innerRef={input => {
                            this._passwordInput = input;
                        }}
                    />
                </PasswordRow>
                <ButtonsRow>
                    <ButtercupButton onClick={() => {}} disabled={false}>
                        Remove Archive
                    </ButtercupButton>
                    <ButtercupButton onClick={event => this.handleCancelUnlock(event)} disabled={false}>
                        Cancel
                    </ButtercupButton>
                    <ButtercupButton onClick={event => this.handleUnlockArchive(event)} disabled={false}>
                        Unlock
                    </ButtercupButton>
                </ButtonsRow>
            </LayoutMain>
        );
    }
}

export default ArchiveUnlockPage;
