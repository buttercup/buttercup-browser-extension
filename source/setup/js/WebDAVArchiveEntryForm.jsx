import React from "react";
import createWebDAVFS from "webdav-fs";
import anyFs from "any-fs";

import BaseFSArchiveEntryForm from "./BaseFSArchiveEntryForm";
import ConnectArchiveDialog from "./ConnectArchiveDialog";

class WebDAVArchiveEntryForm extends BaseFSArchiveEntryForm {

    constructor(props) {
        super(props);
        Object.assign(this.state, {
            type: "webdav",
            webdav_address: "",
            webdav_username: "",
            webdav_password: "",
            webdav_path: ""
        });
    }

    createFS() {
        if (this.state.webdav_address.trim().length <= 0) {
            return null;
        }
        let wfs;
        if (this.state.webdav_username && this.state.webdav_username.trim().length > 0) {
            if (this.state.webdav_password.trim().length <= 0) {
                return null;
            }
            wfs = createWebDAVFS(
                this.state.webdav_address,
                this.state.webdav_username,
                this.state.webdav_password
            );
        } else {
            wfs = createWebDAVFS(this.state.webdav_address);
        }
        return anyFs(wfs);
    }

    onArchiveSelected(filePath, createNew) {
        this.setState({
            connect: createNew ? "new" : "existing",
            webdav_path: filePath
        });
    }

    renderFormContents() {
        let fsReady = !!this.fs;
        return <div>
            {super.renderFormContents()}
            <div className="row">
                <input
                    type="text"
                    name="webdav_address"
                    value={this.state.webdav_address}
                    onChange={this.handleChange}
                    onBlur={() => this.checkFS()}
                    />
                <label>WebDAV address</label>
            </div>
            <div className="row">
                <input
                    type="text"
                    name="webdav_username"
                    value={this.state.webdav_username}
                    onChange={this.handleChange}
                    onBlur={() => this.checkFS()}
                    />
                <label>WebDAV username</label>
            </div>
            <div className="row">
                <input
                    type="password"
                    name="webdav_password"
                    value={this.state.webdav_password}
                    onChange={this.handleChange}
                    onBlur={() => this.checkFS()}
                    />
                <label>WebDAV password</label>
            </div>
            <div className="row remotePath">
                <input
                    type="text"
                    name="webdav_path"
                    value={this.state.webdav_path}
                    onChange={this.handleChange}
                    disabled={!fsReady}
                    />
                <label>Remote archive path</label>
                <ConnectArchiveDialog
                        fs={this.fs}
                        disabled={!fsReady}
                        explorerActive={fsReady}
                        onArchiveSelected={(...args) => this.onArchiveSelected(...args)}
                        />
            </div>
        </div>;
    }

}

export default WebDAVArchiveEntryForm;
