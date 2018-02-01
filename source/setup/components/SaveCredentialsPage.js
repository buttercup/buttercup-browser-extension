import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Input as ButtercupInput, Button as ButtercupButton } from "@buttercup/ui";
import LayoutMain from "./LayoutMain.js";
import { closeCurrentTab } from "../../shared/library/extension.js";
import { FormButtonContainer, FormContainer, FormLegendItem, FormRow, FormInputItem } from "./forms.js";

// const PasswordRow = styled.div`
//     width: 100%;
//     display: flex;
//     flex-direction: row;
//     justify-content: flex-start;
//     align-items: center;
//     margin-bottom: 30px;
// `;
// const PasswordLabel = styled.label`
//     margin-right: 6px;
// `;
// const ButtonsRow = styled.div`
//     width: 100%;
//     display: flex;
//     flex-direction: row;
//     justify-content: flex-end;
//     align-items: center;

//     > * {
//         margin-left: 12px;
//     }
// `;

class SaveCredentialsPage extends Component {
    static propTypes = {
        // archiveTitle: PropTypes.string.isRequired,
        // isEditing: PropTypes.bool.isRequired,
        // onLockArchive: PropTypes.func.isRequired,
        // onRemoveArchive: PropTypes.func.isRequired,
        // onUnlockArchive: PropTypes.func.isRequired,
        // sourceID: PropTypes.string.isRequired,
        // state: PropTypes.oneOf(["locked", "unlocked"]).isRequired
    };

    // We store some details in the state, because they're sensitive:
    state = {
        // masterPassword: ""
    };

    componentDidMount() {
        // setTimeout(() => {
        //     this._passwordInput.focus();
        // }, 100);
    }

    render() {
        return (
            <LayoutMain title={"Save New Credentials"}>
                <h3>Test</h3>
                <FormContainer>
                    <FormRow>
                        <FormLegendItem>Name</FormLegendItem>
                        <FormInputItem>
                            <ButtercupInput placeholder="Enter archive name..." onChange={event => {}} value={""} />
                        </FormInputItem>
                    </FormRow>
                </FormContainer>
                {/*<PasswordRow>
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
                    <ButtercupButton onClick={::this.handleRemoveArchive} disabled={disableForm}>
                        Remove Archive
                    </ButtercupButton>
                    <ButtercupButton onClick={::this.handleCancelUnlock} disabled={disableForm}>
                        Cancel
                    </ButtercupButton>
                    <ButtercupButton onClick={::this.handleUnlockArchive} disabled={disableForm}>
                        Unlock
                    </ButtercupButton>
                </ButtonsRow>*/}
            </LayoutMain>
        );
    }
}

export default SaveCredentialsPage;
