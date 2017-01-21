"use strict";

const React = require("react");
const createWebDAVFS = require("webdav-fs");
const anyFs = require("any-fs");

const ArchiveEntryForm = require("./ArchiveEntryForm");
const ConnectArchiveDialog = require("./ConnectArchiveDialog");

class WebDAVArchiveEntryForm extends ArchiveEntryForm {

    constructor(props) {
        super(props);
        Object.assign(this.state, {
            type: "webdav",
            webdav_address: "",
            webdav_username: "",
            webdav_password: "",
            webdav_path: ""
        });
        this.fs = null;
        this._checkingFs = false;
        this._checkAgain = false;
    }

    checkFS() {
        if (this._checkingFs) {
            this._checkAgain = true;
            return;
        }
        console.log("Checking fs");
        let fs = this.createFS();
        if (fs === null) {
            return;
        }
        this._checkingFs = true;
        fs.readDirectory("/").then(
            () => {
                this._checkingFs = false;
                this._checkAgain = false;
                this.fs = fs;
                console.log("Fs success");
                this.forceUpdate();
            },
            (err) => {
                console.log("Fs failure", err);
                this._checkingFs = false;
                let checkAgain = this._checkAgain;
                this._checkAgain = false;
                if (checkAgain) {
                    console.log("Check fs again");
                    this.checkFS();
                }
                return Promise.resolve();
            }
        );
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
        </div>
    }

}

module.exports = WebDAVArchiveEntryForm;
