"use strict";

const React = require("react");
const createDropboxFS = require("dropbox-fs");
const anyFs = require("any-fs");

const ArchiveEntryForm = require("./ArchiveEntryForm");
const ConnectArchiveDialog = require("./ConnectArchiveDialog");

class DropboxArchiveEntryForm extends ArchiveEntryForm {

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

    createFS() {
        let dfs = createDropboxFS({
            apiKey: this.state.dropbox_token
        });
        return anyFs(dfs);
    }

    onArchiveSelected(filePath, createNew) {
        this.setState({
            connect: createNew ? "new" : "existing",
            dropbox_path: filePath
        });
    }

    onAuthenticateClicked(event) {
        event.preventDefault();
        this.enable(false);
        chrome.runtime.sendMessage({ command: "authenticate-dropbox" }, (response) => {
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
        let fsInstance = this.state.authenticated ?
            this.createFS() :
            null;
        return (
            <div>
                {super.renderFormContents()}
                <button onClick={(e) => this.onAuthenticateClicked(e)} disabled={this.state.authenticated}>Authenticate Dropbox account</button>
                <label>
                    Remote archive path:
                    <input type="text" name="dropbox_path" value={this.state.dropbox_path} onChange={this.handleChange} disabled={!this.state.authenticated} />
                    <ConnectArchiveDialog
                        fs={fsInstance}
                        disabled={!this.state.authenticated}
                        onArchiveSelected={(...args) => this.onArchiveSelected(...args)}
                        />
                </label>
                <input type="hidden" name="dropbox_token" value={this.state.dropbox_token} />
            </div>
        );
    }

}

module.exports = DropboxArchiveEntryForm;
