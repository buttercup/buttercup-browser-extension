import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import styled from "styled-components";
import Spinner from "react-spinkit";
import { Input as ButtercupInput, Button as ButtercupButton } from "@buttercup/ui";
import { notifyError } from "../library/notify.js";
import LayoutMain from "./LayoutMain.js";
import { closeCurrentTab } from "../../shared/library/extension.js";
import { FormButtonContainer, FormContainer, FormLegendItem, FormRow, FormInputItem } from "./forms.js";

const LoaderContainer = styled.div`
    width: 100%;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const LoaderHint = styled.span`
    margin-top: 24px;
    font-style: italic;
    font-color: #444;
    font-size: 13px;
`;

class SaveCredentialsPage extends Component {
    static propTypes = {
        fetchLoginDetails: PropTypes.func.isRequired
    };

    // We store some details in the state, because they're sensitive:
    state = {
        groupID: "",
        loading: true,
        password: "",
        passwordConfirm: "",
        sourceID: "",
        title: "",
        url: "",
        username: ""
    };

    componentDidMount() {
        this.props
            .fetchLoginDetails()
            .then(details => {
                const { username, password, url, title } = details;
                this.setState({
                    username,
                    password,
                    url,
                    title
                });
            })
            .catch(err => {
                console.error(err);
                notifyError(
                    "Failed retrieving credentials",
                    `An error occurred while trying to fetch credentials: ${err.message}`
                );
            });
    }

    render() {
        return (
            <LayoutMain title={"Save New Credentials"}>
                <h3>New Entry Details</h3>
                <Choose>
                    <When condition={this.state.loading}>
                        <LoaderContainer>
                            <Spinner color="rgba(0, 183, 172, 1)" name="ball-grid-pulse" />
                        </LoaderContainer>
                    </When>
                    <Otherwise>
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
                                    <ButtercupInput
                                        placeholder="Enter URL..."
                                        onChange={event => {}}
                                        value={this.state.url}
                                    />
                                </FormInputItem>
                            </FormRow>
                            <FormRow>
                                <FormLegendItem>Archive</FormLegendItem>
                                <FormInputItem>
                                    <Select
                                        name="sourceID"
                                        value={this.state.sourceID}
                                        onChange={() => {}}
                                        style={{
                                            width: "280px"
                                        }}
                                        options={[
                                            { value: "1", label: "Perry's Archive" },
                                            { value: "2", label: "Someone's Archive" }
                                        ]}
                                    />
                                </FormInputItem>
                            </FormRow>
                            <FormRow>
                                <FormLegendItem>Group</FormLegendItem>
                                <FormInputItem>
                                    <Select
                                        name="groupID"
                                        value={this.state.groupID}
                                        onChange={() => {}}
                                        style={{
                                            width: "280px"
                                        }}
                                        options={[{ value: "1", label: "General" }, { value: "2", label: "Trash" }]}
                                    />
                                </FormInputItem>
                            </FormRow>
                        </FormContainer>
                        <FormButtonContainer>
                            <ButtercupButton onClick={event => {}}>Save New Entry</ButtercupButton>
                            <ButtercupButton onClick={event => {}}>Cancel</ButtercupButton>
                        </FormButtonContainer>
                    </Otherwise>
                </Choose>
            </LayoutMain>
        );
    }
}

export default SaveCredentialsPage;
