"use strict";

const React = require("react");

const ArchiveEntryForm = require("./ArchiveEntryForm");

class OwnCloudArchiveEntryForm extends ArchiveEntryForm {

    constructor(props) {
        super(props);
        this.state.type = "owncloud";
    }

    renderFormContents() {
        return <div>
            {super.renderFormContents()}
            <label>
                ownCloud instance address:
                <input type="text" name="owncloud_address" defaultValue={this.state.owncloud_address} onChange={this.handleChange} />
            </label>
            <label>
                Remote archive path:
                <input type="text" name="owncloud_path" defaultValue={this.state.owncloud_path} onChange={this.handleChange} />
            </label>
            <label>
                ownCloud username:
                <input type="text" name="owncloud_username" defaultValue={this.state.owncloud_username} onChange={this.handleChange} />
            </label>
            <label>
                ownCloud password:
                <input type="password" name="owncloud_password" defaultValue={this.state.owncloud_password} onChange={this.handleChange} />
            </label>
        </div>
    }

}

module.exports = OwnCloudArchiveEntryForm;
