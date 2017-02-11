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
            owncloud_address: "",
            owncloud_username: "",
            owncloud_password: "",
            owncloud_path: ""
        });
    }

    createFS() {
        if (this.state.owncloud_address.trim().length <= 0) {
            return null;
        }
        let wfs,
            owncloudAddress = url.resolve(this.state.owncloud_address, "/remote.php/webdav/");
        if (this.state.owncloud_username && this.state.owncloud_username.trim().length > 0) {
            if (this.state.owncloud_password.trim().length <= 0) {
                return null;
            }
            wfs = createWebDAVFS(
                owncloudAddress,
                this.state.owncloud_username,
                this.state.owncloud_password
            );
            return anyFs(wfs);
        }
        return null;
    }

    onArchiveSelected(filePath, createNew) {
        this.setState({
            connect: createNew ? "new" : "existing",
            owncloud_path: filePath
        });
    }

    renderFormContents() {
        return <div>
            {super.renderFormContents()}
            <div className="row">
                <input
                    type="text"
                    name="owncloud_address"
                    value={this.state.owncloud_address}
                    onChange={this.handleChange}
                    onBlur={() => this.checkFS()}
                    />
                <label>OwnCloud address</label>
            </div>
            <div className="row">
                <input
                    type="text"
                    name="owncloud_username"
                    value={this.state.owncloud_username}
                    onChange={this.handleChange}
                    onBlur={() => this.checkFS()}
                    />
                <label>OwnCloud username</label>
            </div>
            <div className="row">
                <input
                    type="password"
                    name="owncloud_password"
                    value={this.state.owncloud_password}
                    onChange={this.handleChange}
                    onBlur={() => this.checkFS()}
                    />
                <label>OwnCloud password</label>
            </div>
            <div className="row remotePath">
                <input
                    type="text"
                    name="owncloud_path"
                    value={this.state.owncloud_path}
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
