import React from "react";

import createDropboxFS from "dropbox-fs";
import anyFs from "any-fs";

import ArchiveEntryForm from "./ArchiveEntryForm";
import ConnectArchiveDialog from "./ConnectArchiveDialog";

class DropboxArchiveEntryForm extends ArchiveEntryForm {

    componentWillMount() {
        this.setState({
            submitEnabled: false,
            type: "dropbox",
            authenticated: false,
            dropboxToken: "",
            dropboxPath: ""
        });
    }

    createFS() {
        let dfs = createDropboxFS({
            apiKey: this.state.dropboxToken
        });
        return anyFs(dfs);
    }

    onArchiveSelected(filePath, createNew) {
        this.setState({
            connect: createNew ? "new" : "existing",
            dropboxPath: filePath
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
            dropboxToken: token
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
                <div className="row">
                    <button onClick={(e) => this.onAuthenticateClicked(e)} disabled={this.state.authenticated}>Authenticate Dropbox account</button>
                </div>
                <div className="row remotePath">
                    <input type="text" name="dropboxPath" value={this.state.dropboxPath} onChange={this.handleChange} disabled={!this.state.authenticated} />
                    <label>Remote path</label>
                    <ConnectArchiveDialog
                        explorerActive={true}
                        fs={fsInstance}
                        disabled={!this.state.authenticated}
                        onArchiveSelected={(...args) => this.onArchiveSelected(...args)}
                        />
                </div>
                <input type="hidden" name="dropboxToken" value={this.state.dropboxToken} />
            </div>
        );
    }

}

export default DropboxArchiveEntryForm;
