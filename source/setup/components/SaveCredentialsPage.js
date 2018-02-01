import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Input as ButtercupInput, Button as ButtercupButton } from "@buttercup/ui";
import LayoutMain from "./LayoutMain.js";
import { closeCurrentTab } from "../../shared/library/extension.js";
import { FormButtonContainer, FormContainer, FormLegendItem, FormRow, FormInputItem } from "./forms.js";

class SaveCredentialsPage extends Component {
    static propTypes = {
        fetchLoginDetails: PropTypes.func.isRequired
    };

    // We store some details in the state, because they're sensitive:
    state = {
        password: "",
        passwordConfirm: "",
        title: "",
        url: "",
        username: ""
    };

    componentDidMount() {
        this.props.fetchLoginDetails().then(details => {
            console.log("DEETS", details);
            const { username, password, url, title } = details;
            this.setState({
                username,
                password,
                url,
                title
            });
        });
    }

    render() {
        return (
            <LayoutMain title={"Save New Credentials"}>
                <h3>New Entry Details</h3>
                <FormContainer>
                    <FormRow>
                        <FormLegendItem>Title</FormLegendItem>
                        <FormInputItem>
                            <ButtercupInput
                                placeholder="Enter entry title..."
                                onChange={event => {}}
                                value={this.state.title}
                            />
                        </FormInputItem>
                    </FormRow>
                    <FormRow>
                        <FormLegendItem>Username</FormLegendItem>
                        <FormInputItem>
                            <ButtercupInput
                                placeholder="Enter username..."
                                onChange={event => {}}
                                value={this.state.username}
                            />
                        </FormInputItem>
                    </FormRow>
                    <FormRow>
                        <FormLegendItem>Password</FormLegendItem>
                        <FormInputItem>
                            <ButtercupInput
                                placeholder="Enter password..."
                                onChange={event => {}}
                                value={this.state.password}
                                type="password"
                            />
                        </FormInputItem>
                    </FormRow>
                    <FormRow>
                        <FormLegendItem>Confirm Password</FormLegendItem>
                        <FormInputItem>
                            <ButtercupInput
                                placeholder="Enter password again..."
                                onChange={event => {}}
                                value={this.state.passwordConfirm}
                                type="password"
                            />
                        </FormInputItem>
                    </FormRow>
                    <FormRow>
                        <FormLegendItem>URL</FormLegendItem>
                        <FormInputItem>
                            <ButtercupInput placeholder="Enter URL..." onChange={event => {}} value={this.state.url} />
                        </FormInputItem>
                    </FormRow>
                </FormContainer>
                <FormButtonContainer>
                    <ButtercupButton onClick={event => {}}>Save New Entry</ButtercupButton>
                    <ButtercupButton onClick={event => {}}>Cancel</ButtercupButton>
                </FormButtonContainer>
            </LayoutMain>
        );
    }
}

export default SaveCredentialsPage;
