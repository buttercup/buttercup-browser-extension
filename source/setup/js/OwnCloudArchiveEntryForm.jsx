import url from "url";
import React from "react";

import createWebDAVFS from "webdav-fs";
import anyFs from "any-fs";

import BaseFSArchiveEntryForm from "./BaseFSArchiveEntryForm";
import ConnectArchiveDialog from "./ConnectArchiveDialog";

class OwnCloudArchiveEntryForm extends BaseFSArchiveEntryForm {

    constructor(props) {
        super(props);
        Object.assign(this.state, {
            type: "owncloud",
            owncloudAddress: "",
            owncloudUsername: "",
            owncloudPassword: "",
            owncloudPath: ""
        });
    }

    createFS() {
        if (this.state.owncloudAddress.trim().length <= 0) {
            return null;
        }
        let wfs;
        const owncloudAddress = url.resolve(this.state.owncloudAddress, "remote.php/webdav/");
        if (this.state.owncloudUsername && this.state.owncloudUsername.trim().length > 0) {
            if (this.state.owncloudPassword.trim().length <= 0) {
                return null;
            }
            wfs = createWebDAVFS(
                owncloudAddress,
                this.state.owncloudUsername,
                this.state.owncloudPassword
            );
            return anyFs(wfs);
        }
        return null;
    }

    onArchiveSelected(filePath, createNew) {
        this.setState({
            connect: createNew ? "new" : "existing",
            owncloudPath: filePath
        });
    }

    renderFormContents() {
        return <div>
            {super.renderFormContents()}
            <div className="row">
                <input
                    type="text"
                    name="owncloudAddress"
                    value={this.state.owncloudAddress}
                    onChange={this.handleChange}
                    onBlur={() => this.checkFS()}
                    />
                <label>OwnCloud address</label>
            </div>
            <div className="row">
                <input
                    type="text"
                    name="owncloudUsername"
                    value={this.state.owncloudUsername}
                    onChange={this.handleChange}
                    onBlur={() => this.checkFS()}
                    />
                <label>OwnCloud username</label>
            </div>
            <div className="row">
                <input
                    type="password"
                    name="owncloudPassword"
                    value={this.state.owncloudPassword}
                    onChange={this.handleChange}
                    onBlur={() => this.checkFS()}
                    />
                <label>OwnCloud password</label>
            </div>
            <div className="row remotePath">
                <input
                    type="text"
                    name="owncloudPath"
                    value={this.state.owncloudPath}
                    onChange={this.handleChange}
                    />
                <label>Remote archive path</label>
                <ConnectArchiveDialog
                        fs={this.fs}
                        onArchiveSelected={(...args) => this.onArchiveSelected(...args)}
                        />
            </div>
        </div>;
    }

}

export default OwnCloudArchiveEntryForm;
