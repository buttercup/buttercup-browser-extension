import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Async as Select } from "react-select";
import styled from "styled-components";
import {
    FormGroup,
    InputGroup,
    ControlGroup,
    Button,
    Classes,
    H4,
    Card,
    Intent,
    Spinner,
    Callout
} from "@blueprintjs/core";
import { notifyError } from "../library/notify.js";
import LayoutMain from "./LayoutMain.js";
import { closeCurrentTab } from "../../shared/library/extension.js";

function flattenGroups(groups) {
    const processed = [];
    const nestGroup = (group, level = 0) => {
        processed.push({
            ...group,
            level
        });
        group.groups.sort(titleCompare).forEach(child => nestGroup(child, level + 1));
    };
    groups.sort(titleCompare).forEach(group => nestGroup(group));
    return processed;
}

function titleCompare(a, b) {
    return a.title.localeCompare(b.title);
}

const ButtonRow = styled.div`
    margin-top: 1rem;

    button {
        margin-right: 0.5rem;
    }
`;
const SelectColumns = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
`;

const ArchiveShape = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
});

class SaveCredentialsPage extends PureComponent {
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
        showPassword: false,
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

    handleShowPasswordClick(event) {
        event.preventDefault();
        this.setState(state => ({
            ...state,
            showPassword: !state.showPassword
        }));
    }

    render() {
        const selectedArchive = this.state.sourceID && this.state.sourceID.length > 0;
        return (
            <LayoutMain title="Save New Credentials">
                <H4>New Entry Details</H4>
                <Card>
                    <Choose>
                        <When condition={this.state.loading}>
                            <Spinner size="20" />
                        </When>
                        <Otherwise>
                            <FormGroup label="Title">
                                <InputGroup
                                    leftIcon="new-text-box"
                                    placeholder="Enter entry title..."
                                    onChange={event => this.handleEditProperty("title", event)}
                                    value={this.state.title}
                                />
                            </FormGroup>
                            <FormGroup label="Username">
                                <InputGroup
                                    leftIcon="user"
                                    placeholder="Enter username..."
                                    onChange={event => this.handleEditProperty("username", event)}
                                    value={this.state.username}
                                />
                            </FormGroup>
                            <FormGroup label="Password">
                                <ControlGroup>
                                    <InputGroup
                                        className={Classes.FILL}
                                        leftIcon="key"
                                        placeholder="Enter password..."
                                        onChange={event => this.handleEditProperty("password", event)}
                                        value={this.state.password}
                                        type={this.state.showPassword ? "text" : "password"}
                                    />
                                    <Button
                                        active={this.state.showPassword}
                                        icon={this.state.showPassword ? "eye-open" : "eye-off"}
                                        onClick={::this.handleShowPasswordClick}
                                    />
                                </ControlGroup>
                            </FormGroup>
                            <FormGroup label="URL">
                                <InputGroup
                                    leftIcon="globe"
                                    placeholder="Enter URL..."
                                    onChange={event => this.handleEditProperty("url", event)}
                                    value={this.state.url}
                                />
                            </FormGroup>
                            <FormGroup label="Archive and Group">
                                <SelectColumns>
                                    <Select
                                        name="sourceID"
                                        value={this.state.sourceID}
                                        onChange={::this.handleArchiveSourceChange}
                                        autoload={true}
                                        cache={false}
                                        searchable={false}
                                        placeholder="Select archive..."
                                        loadingPlaceholder="Fetching archives..."
                                        loadOptions={::this.fetchArchiveOptions}
                                    />
                                    <If condition={selectedArchive}>
                                        <Select
                                            name="groupID"
                                            value={this.state.groupID}
                                            onChange={::this.handleArchiveGroupChange}
                                            autoload={true}
                                            cache={false}
                                            searchable={false}
                                            placeholder="Select group..."
                                            loadingPlaceholder="Fetching groups..."
                                            loadOptions={::this.fetchGroupOptions}
                                        />
                                    </If>
                                </SelectColumns>
                            </FormGroup>
                            <If condition={this.props.archives.length <= 0}>
                                <Callout intent={Intent.WARNING}>
                                    No <strong>unlocked</strong> archives were found. You must unlock at least one
                                    archive to be able to save new credentials.
                                </Callout>
                            </If>
                            <ButtonRow>
                                <Button
                                    icon="floppy-disk"
                                    text="Save New Entry"
                                    onClick={::this.handleSaveClicked}
                                    intent={Intent.PRIMARY}
                                />
                                <Button text="Cancel" onClick={::this.handleCancelClick} />
                            </ButtonRow>
                        </Otherwise>
                    </Choose>
                </Card>
            </LayoutMain>
        );
    }
}

export default SaveCredentialsPage;
