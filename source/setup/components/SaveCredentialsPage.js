import React, { Component } from "react";
import PropTypes from "prop-types";
import { Async as Select } from "react-select";
import FontAwesome from "react-fontawesome";
import styled from "styled-components";
import Spinner from "react-spinkit";
import { Input as ButtercupInput, Button as ButtercupButton } from "@buttercup/ui";
import { notifyError } from "../library/notify.js";
import LayoutMain from "./LayoutMain.js";
import { closeCurrentTab } from "../../shared/library/extension.js";
import { FormButtonContainer, FormContainer, FormLegendItem, FormRow, FormInputItem } from "./forms.js";

const FormInputItemColumnLayout = styled(FormInputItem)`
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
`;

function flattenGroups(groups) {
    const processed = [];
    const nestGroup = (group, level = 0) => {
        processed.push({
            ...group,
            level
        });
        group.groups.forEach(child => nestGroup(child, level + 1));
    };
    groups.forEach(group => nestGroup(group));
    return processed;
}

const LoaderContainer = styled.div`
    width: 100%;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const NoArchivesNotice = styled.span`
    font-size: 13px;
    color: rgb(242, 159, 4);
`;
const SelectArchiveHint = styled.span`
    font-style: italic;
    font-color: #444;
    font-size: 13px;
`;

const ArchiveShape = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
});

class SaveCredentialsPage extends Component {
    static propTypes = {
        archives: PropTypes.arrayOf(ArchiveShape).isRequired,
        cancel: PropTypes.func.isRequired,
        fetchGroupsForArchive: PropTypes.func.isRequired,
        fetchLoginDetails: PropTypes.func.isRequired,
        saveNewCredentials: PropTypes.func.isRequired
    };

    state = {
        groupID: "",
        loading: true,
        password: "",
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
                    title,
                    loading: false
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

    fetchArchiveOptions(input) {
        if (this.state.sourceID && this.state.sourceID.length > 0) {
            const sourceItem = this.props.archives.find(archive => archive.id === this.state.sourceID);
            if (!sourceItem) {
                this.setState({
                    groupID: "",
                    sourceID: ""
                });
            }
        }
        return Promise.resolve({
            options: this.props.archives.map(archive => ({
                value: archive.id,
                label: archive.title
            }))
        });
    }

    fetchGroupOptions(input) {
        const nestTitle = (title, level = 0) => {
            let indent = level,
                spacing = "";
            while (indent > 0) {
                spacing += "\u00A0\u00A0\u00A0";
                indent -= 1;
            }
            return level > 0 ? `${spacing}\u21B3 ${title}` : title;
        };
        return this.props
            .fetchGroupsForArchive(this.state.sourceID)
            .then(flattenGroups)
            .then(groups => ({
                options: groups.map(group => ({
                    value: group.id,
                    label: nestTitle(group.title, group.level)
                }))
            }));
    }

    handleArchiveGroupChange(selected) {
        const { value } = selected;
        this.setState({
            groupID: value
        });
    }

    handleArchiveSourceChange(selected) {
        const { value } = selected;
        this.setState({
            groupID: "",
            groups: [],
            sourceID: value
        });
    }

    handleCancelClick(event) {
        event.preventDefault();
        this.props.cancel();
    }

    handleEditProperty(property, event) {
        this.setState({
            [property]: event.target.value
        });
    }

    handleSaveClicked(event) {
        event.preventDefault();
        this.props.saveNewCredentials(this.state.sourceID, this.state.groupID, {
            username: this.state.username,
            password: this.state.password,
            title: this.state.title,
            url: this.state.url
        });
    }

    render() {
        const selectedArchive = this.state.sourceID && this.state.sourceID.length > 0;
        return (
            <LayoutMain title="Save New Credentials">
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
                                        onChange={event => this.handleEditProperty("title", event)}
                                        value={this.state.title}
                                    />
                                </FormInputItem>
                            </FormRow>
                            <FormRow>
                                <FormLegendItem>Username</FormLegendItem>
                                <FormInputItem>
                                    <ButtercupInput
                                        placeholder="Enter username..."
                                        onChange={event => this.handleEditProperty("username", event)}
                                        value={this.state.username}
                                    />
                                </FormInputItem>
                            </FormRow>
                            <FormRow>
                                <FormLegendItem>Password</FormLegendItem>
                                <FormInputItem>
                                    <ButtercupInput
                                        placeholder="Enter password..."
                                        onChange={event => this.handleEditProperty("password", event)}
                                        value={this.state.password}
                                        type="password"
                                    />
                                </FormInputItem>
                            </FormRow>
                            <FormRow>
                                <FormLegendItem>URL</FormLegendItem>
                                <FormInputItem>
                                    <ButtercupInput
                                        placeholder="Enter URL..."
                                        onChange={event => this.handleEditProperty("url", event)}
                                        value={this.state.url}
                                    />
                                </FormInputItem>
                            </FormRow>
                            <FormRow>
                                <FormLegendItem>Archive</FormLegendItem>
                                <FormInputItemColumnLayout>
                                    <Select
                                        name="sourceID"
                                        value={this.state.sourceID}
                                        onChange={::this.handleArchiveSourceChange}
                                        style={{
                                            width: "280px"
                                        }}
                                        autoload={true}
                                        cache={false}
                                        searchable={false}
                                        placeholder="Select archive..."
                                        loadingPlaceholder="Fetching archives..."
                                        loadOptions={::this.fetchArchiveOptions}
                                    />
                                    <If condition={this.props.archives.length <= 0}>
                                        <NoArchivesNotice>
                                            <FontAwesome name="exclamation-circle" /> No <strong>unlocked</strong>{" "}
                                            archives were found. You must unlock at least one archive to be able to save
                                            new credentials.
                                        </NoArchivesNotice>
                                    </If>
                                </FormInputItemColumnLayout>
                            </FormRow>
                            <FormRow>
                                <FormLegendItem>Group</FormLegendItem>
                                <FormInputItem>
                                    <Choose>
                                        <When condition={selectedArchive}>
                                            <Select
                                                name="groupID"
                                                value={this.state.groupID}
                                                onChange={::this.handleArchiveGroupChange}
                                                style={{
                                                    width: "280px"
                                                }}
                                                autoload={true}
                                                cache={false}
                                                searchable={false}
                                                placeholder="Select group..."
                                                loadingPlaceholder="Fetching groups..."
                                                loadOptions={::this.fetchGroupOptions}
                                            />
                                        </When>
                                        <Otherwise>
                                            <SelectArchiveHint>Select an archive to continue...</SelectArchiveHint>
                                        </Otherwise>
                                    </Choose>
                                </FormInputItem>
                            </FormRow>
                        </FormContainer>
                        <FormButtonContainer>
                            <ButtercupButton onClick={::this.handleSaveClicked}>Save New Entry</ButtercupButton>
                            <ButtercupButton onClick={::this.handleCancelClick}>Cancel</ButtercupButton>
                        </FormButtonContainer>
                    </Otherwise>
                </Choose>
            </LayoutMain>
        );
    }
}

export default SaveCredentialsPage;
