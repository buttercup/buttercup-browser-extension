import React from "react";

import ArchiveGroupExplorer from "./ArchiveGroupExplorer";

import "AddLastLoginForm.sass";

const NOPE = function() {};

function closeTab() {
    chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.remove(tab.id, NOPE);
    });
}

function validateDataset(data, soft = true) {
    let errors = [];
    if (data.title.trim().length <= 0) {
        errors.push("Title is empty");
    }
    if (data.username.trim().length <= 0) {
        errors.push("Username is empty");
    }
    if (data.password.trim().length <= 0) {
        errors.push("Password is empty");
    }
    if (data.url.trim().length <= 0) {
        errors.push("URL is empty");
    }
    if (data.archiveID.trim().length <= 0) {
        errors.push("No destination archive chosen");
    }
    if (data.groupID.trim().length <= 0) {
        errors.push("No destination group chosen");
    }
    if (errors.length > 0 && !soft) {
        alert(`Unable to save due to some errors:\n\n${errors.join("\n")}`);
    }
    return errors.length === 0;
}

class AddLastLoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            canSave: false,
            title: "",
            username: "",
            password: "",
            url: "",
            loginURL: "",
            archiveID: "",
            groupID: ""
        };
    }

    componentWillMount() {
        this.fetchLastSubmission();
    }

    enable(en = true) {
        this.setState({ canSave: en });
    }

    fetchLastSubmission() {
        chrome.runtime.sendMessage({ command: "last-form-submission" }, (response) => {
            if (response && response.ok === true) {
                response.data.values.forEach((inputValue) => {
                    if (inputValue.type === "property") {
                        this.setState({
                            [inputValue.property]: inputValue.value
                        });
                    }
                });
                if (response.data.url) {
                    this.setState({
                        url: response.data.url,
                        loginURL: response.data.loginURL
                    });
                }
            } else {
                alert("There was an error fetching the submitted details:\n" + response.error);
                closeTab();
            }
        });
    }

    handleChange(event) {
        let input = event.target,
            value = input.value,
            name = input.getAttribute("name");
        this.setState(
            {
                [name]: value
            },
            () => {
                this.validateChanges();
            }
        );
    }

    handleSubmit(event) {
        event.preventDefault();
        let ok = this.validateChanges(/* quiet check */ false);
        if (!ok) {
            return;
        }
        chrome.runtime.sendMessage({ command: "save-new-entry", data: this.state }, (response) => {
            if (response && response.ok === true) {
                // @todo show message
                closeTab();
            } else {
                let errorMessage = (response && response.error) || "Unknown error";
                alert("There was an error saving the entry:\n" + errorMessage);
                this.enable(true);
            }
        });
    }

    onSelect(archiveID, groupID) {
        this.setState(
            { archiveID, groupID },
            () => {
                this.validateChanges();
            }
        );
    }

    render() {
        return (
            <form className="addLastLogin buttercup">
                <fieldset>
                    <h4>Choose a destination for saving</h4>
                    <ArchiveGroupExplorer onSelect={this.onSelect.bind(this)} />
                    <h4>Edit details before saving</h4>
                    <div className="row">
                        <input
                            type="text"
                            name="title"
                            value={this.state.title}
                            onChange={(e) => this.handleChange(e)}
                            />
                        <label>Title</label>
                    </div>
                    <div className="row">
                        <input
                            type="text"
                            name="username"
                            value={this.state.username}
                            onChange={(e) => this.handleChange(e)}
                            />
                        <label>Username</label>
                    </div>
                    <div className="row">
                        <input
                            type="password"
                            name="password"
                            value={this.state.password}
                            onChange={(e) => this.handleChange(e)}
                            />
                        <label>Password</label>
                    </div>
                    <div className="row">
                        <input
                            type="text"
                            name="url"
                            value={this.state.url}
                            onChange={(e) => this.handleChange(e)}
                            />
                        <label>URL</label>
                    </div>
                    <div className="row">
                        <input
                            type="text"
                            name="loginURL"
                            value={this.state.loginURL}
                            onChange={(e) => this.handleChange(e)}
                            />
                        <label>URL (login)</label>
                    </div>
                    <div className="row">
                        <button
                            disabled={!this.state.canSave}
                            onClick={(e) => this.handleSubmit(e)}
                            >
                            Save
                        </button>
                    </div>
                </fieldset>
            </form>
        );
    }

    validateChanges(soft = true) {
        let isValid = validateDataset(this.state, soft);
        this.enable(isValid);
        return isValid;
    }

}

export default AddLastLoginForm;
