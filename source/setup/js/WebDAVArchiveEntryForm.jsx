import React from "react";
import createWebDAVFS from "webdav-fs";
import anyFs from "any-fs";
import { isNil } from "lodash";

import BaseFSArchiveEntryForm from "./BaseFSArchiveEntryForm";
import ConnectArchiveDialog from "./ConnectArchiveDialog";

class WebDAVArchiveEntryForm extends BaseFSArchiveEntryForm {

    constructor(props) {
        super(props);
        Object.assign(this.state, {
            type: "webdav",
            webdavAddress: "",
            webdavUsername: "",
            webdavPassword: "",
            webdavPath: ""
        });
    }

    createFS() {
        if (this.state.webdavAddress.trim().length <= 0) {
            return null;
        }
        let wfs;
        if (this.state.webdavUsername && this.state.webdavUsername.trim().length > 0) {
            if (this.state.webdavPassword.trim().length <= 0) {
                return null;
            }
            wfs = createWebDAVFS(
                this.state.webdavAddress,
                this.state.webdavUsername,
                this.state.webdavPassword
            );
            return anyFs(wfs);
        }
        return null;
    }

    onArchiveSelected(filePath, createNew) {
        this.setState({
            connect: createNew ? "new" : "existing",
            webdavPath: filePath
        });
    }

    renderFormContents() {
        let fsReady = isNil(this.fs);
        return <div>
            {super.renderFormContents()}
            <div className="row">
                <input
                    type="text"
                    name="webdavAddress"
                    value={this.state.webdavAddress}
                    onChange={this.handleChange}
                    onBlur={() => this.checkFS()}
                    />
                <label>WebDAV address</label>
            </div>
            <div className="row">
                <input
                    type="text"
                    name="webdavUsername"
                    value={this.state.webdavUsername}
                    onChange={this.handleChange}
                    onBlur={() => this.checkFS()}
                    />
                <label>WebDAV username</label>
            </div>
            <div className="row">
                <input
                    type="password"
                    name="webdavPassword"
                    value={this.state.webdavPassword}
                    onChange={this.handleChange}
                    onBlur={() => this.checkFS()}
                    />
                <label>WebDAV password</label>
            </div>
            <div className="row remotePath">
                <input
                    type="text"
                    name="webdavPath"
                    value={this.state.webdavPath}
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
