"use strict";

const React = require("react");

const ArchiveEntryForm = require("./ArchiveEntryForm");
const RemoteFileExplorer = require("./RemoteFileExplorer");

class DropboxArchiveEntryForm extends ArchiveEntryForm {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({
            submitEnabled: false,
            submitLabel: "Connect",
            type: "dropbox",
            authenticated: false,
            dropbox_token: "",
            dropbox_path: ""
        });
    }

    onAuthenticateClicked(event) {
        event.preventDefault();
        this.enable(false);
        chrome.runtime.sendMessage({ command: "authenticate-dropbox" }, (response) => {
            console.log("RESPONSE", response);
            if (response && response.ok === true) {
                this.onAuthenticated(response.token);
            } else {
                let errorMessage = (response && response.error) || "Unknown error";
                alert("There was an error trying to authenticate with Dropbox:\n" + errorMessage);
                this.enable(true);
            }
        });
    }

    onAuthenticated(token) {
        this.setState({
            submitEnabled: true,
            authenticated: true,
            dropbox_token: token
        });
        this.enable(true);
    }

    renderFormContents() {
        return <div>
            {super.renderFormContents()}
            <button onClick={(e) => this.onAuthenticateClicked(e)} disabled={this.state.authenticated}>Authenticate Dropbox account</button>
            <label>
                Remote archive path:
                <input type="text" name="dropbox_path" value={this.state.dropbox_path} onChange={this.handleChange} disabled={!this.state.authenticated} />
                <RemoteFileExplorer disabled={!this.state.authenticated} />
            </label>
            <input type="hidden" name="dropbox_token" value={this.state.dropbox_token} />
        </div>
    }

}

module.exports = DropboxArchiveEntryForm;
