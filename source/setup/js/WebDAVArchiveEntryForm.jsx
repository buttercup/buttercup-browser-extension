"use strict";

const React = require("react");

const ArchiveEntryForm = require("./ArchiveEntryForm");

class WebDAVArchiveEntryForm extends ArchiveEntryForm {

    renderFormContents() {
        return <div>
            {super.renderFormContents()}
            <label>
                WebDAV address:
                <input type="text" name="webdav_address" value="" onChange={this.handleChange} />
            </label>
            <label>
                WebDAV username (blank for none):
                <input type="text" name="webdav_username" value="" onChange={this.handleChange} />
            </label>
            <label>
                WebDAV password (blank for none):
                <input type="password" name="webdav_password" value="" onChange={this.handleChange} />
            </label>
        </div>
    }

}

module.exports = WebDAVArchiveEntryForm;
