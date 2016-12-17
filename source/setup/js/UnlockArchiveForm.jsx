"use strict";

const React = require("react");

const NOPE = function() {};

class UnlockArchiveForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            password: ""
        };
    }

    enable(en = true) {
        this.setState({ loading: !en });
    }

    handlePasswordChange(event) {
        let input = event.target,
            value = input.value;
        this.setState({
            password: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.enable(false);
        let archiveDetails = {
            password: this.state.password,
            name: this.props.name
        };
        chrome.runtime.sendMessage({ command: "unlock-archive", data: archiveDetails }, function(response) {
            console.log("Response", response);
            if (response && response.ok === true) {
                chrome.tabs.getCurrent(function(tab) {
                    chrome.tabs.remove(tab.id, NOPE);
                });
            } else {
                // @todo error
                alert("There was an error unlocking the archive:\n" + response.error);
                this.enable(true);
            }
        });
    }

    render() {
        return <form>
            <fieldset disabled={this.state.loading}>
                <label>
                    Master password:
                    <input type="password" name="password" value={this.props.password} onChange={(e) => this.handlePasswordChange(e)} />
                </label>
                <input type="submit" value="Unlock" onClick={(e) => this.handleSubmit(e)} />
            </fieldset>
        </form>
    }

}

module.exports = UnlockArchiveForm;
