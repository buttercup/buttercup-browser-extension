"use strict";

const React = require("react");

const NOPE = function() {};

class ArchiveEntryForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            connect: "existing",
            loading: false,
            master_password: "",
            name: "",
            submitEnabled: true,
            submitLabel: "Authenticate",
            type: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    enable(en = true) {
        this.setState({ loading: !en });
    }

    handleChange(event) {
        let input = event.target,
            name = input.getAttribute("name"),
            value = input.value;
        this.setState({
            [name]: value
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        this.enable(false);
        chrome.runtime.sendMessage({ command: "add-archive", data: this.state }, (response) => {
            if (response && response.ok === true) {
                chrome.tabs.getCurrent(function(tab) {
                    chrome.tabs.remove(tab.id, NOPE);
                });
            } else {
                alert("There was an error processing the provided archive details:\n" + response.error);
                this.enable(true);
            }
        });
    }

    render() {
        return <form>
            <fieldset disabled={this.state.loading}>
                {this.renderFormContents()}
                <input type="submit" value={this.state.submitLabel} disabled={!this.state.submitEnabled} onClick={this.handleSubmit} />
            </fieldset>
        </form>
    }

    renderFormContents() {
        return (
            <div>
                <label>
                    Entry name:
                    <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                </label>
                <label>
                    Master password:
                    <input type="password" name="master_password" value={this.state.master_password} onChange={this.handleChange} />
                </label>
            </div>
        );
    }

}

module.exports = ArchiveEntryForm;
