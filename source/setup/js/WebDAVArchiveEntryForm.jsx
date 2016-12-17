"use strict";

const React = require("react");

const ArchiveEntryForm = require("./ArchiveEntryForm");

class WebDAVArchiveEntryForm extends ArchiveEntryForm {

    constructor(props) {
        super(props);
        this.state.type = "webdav";
    }

    renderFormContents() {
        return <div>
            {super.renderFormContents()}
            <label>
                WebDAV address:
                <input type="text" name="webdav_address" defaultValue={this.state.webdav_address} onChange={this.handleChange} />
            </label>
            <label>
                Remote archive path:
                <input type="text" name="webdav_path" defaultValue={this.state.webdav_path} onChange={this.handleChange} />
            </label>
            <label>
                WebDAV username (blank for none):
                <input type="text" name="webdav_username" defaultValue={this.state.webdav_username} onChange={this.handleChange} />
            </label>
            <label>
                WebDAV password (blank for none):
                <input type="password" name="webdav_password" defaultValue={this.state.webdav_password} onChange={this.handleChange} />
            </label>
        </div>
    }

}

module.exports = WebDAVArchiveEntryForm;
