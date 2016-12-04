"use strict";

const React = require("react");

const NOOP = function() {};

class ArchiveEntryForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        let input = event.target,
            name = input.getAttribute("name"),
            value = input.value;
        this.state[name] = value;
    }

    handleSubmit(event) {
        event.preventDefault();
        chrome.runtime.sendMessage({ command: "add-archive", data: this.state }, function(response) {
            if (response && response.ok === true) {
                chrome.tabs.getCurrent(function(tab) {
                    chrome.tabs.remove(tab.id, NOOP);
                });
            } else {
                // @todo error
            }
        });
    }

    render() {
        return <form>
            {this.renderFormContents()}
            <input type="submit" name="Authenticate" onClick={this.handleSubmit} />
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
