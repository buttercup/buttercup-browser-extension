"use strict";

const React = require("react");
const ArchiveGroupExplorer = require("./ArchiveGroupExplorer");

const NOPE = function() {};

function closeTab() {
    chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.remove(tab.id, NOPE);
    });
}

class AddLastLoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            title: "",
            username: "",
            password: "",
            url: "",
            archiveID: "",
            groupID: ""
        };
    }

    componentWillMount() {
        this.fetchLastSubmission();
    }

    enable(en = true) {
        this.setState({ loading: !en });
    }

    fetchLastSubmission() {
        chrome.runtime.sendMessage({ command: "last-form-submission" }, (response) => {
            if (response && response.ok === true) {
                console.log("Data", response.data);
                response.data.values.forEach((inputValue) => {
                    if (inputValue.type === "property") {
                        this.setState({
                            [inputValue.property]: inputValue.value
                        });
                    }
                });
                if (response.data.url) {
                    this.setState({
                        url: response.data.url 
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
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.enable(false);
        chrome.runtime.sendMessage({ command: "save-new-entry", data: this.state }, function(response) {
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

    render() {
        return <form>
            <fieldset disabled={this.state.loading}>
                <ArchiveGroupExplorer />
                <label>
                    Title:
                    <input type="text" name="title" value={this.state.title} onChange={(e) => this.handleChange(e)} />
                </label>
                <label>
                    Username:
                    <input type="text" name="username" value={this.state.username} onChange={(e) => this.handleChange(e)} />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" value={this.state.password} onChange={(e) => this.handleChange(e)} />
                </label>
                <label>
                    URL:
                    <input type="text" name="url" value={this.state.url} onChange={(e) => this.handleChange(e)} />
                </label>
                <input type="submit" value="Save" onClick={(e) => this.handleSubmit(e)} />
            </fieldset>
        </form>
    }

}

module.exports = AddLastLoginForm;
