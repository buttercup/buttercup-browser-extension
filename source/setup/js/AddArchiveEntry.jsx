"use strict";

const React = require("react");

const {
    Link
} = require("react-router");

const WebDAVArchiveEntryForm = require("./WebDAVArchiveEntryForm");
const DropboxArchiveEntryForm = require("./DropboxArchiveEntryForm");
const OwnCloudArchiveEntryForm = require("./OwnCloudArchiveEntryForm");

class AddArchiveEntry extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let FormClass;
        switch(this.props.params.type) {
            case "webdav": {
                FormClass = WebDAVArchiveEntryForm;
                break;
            }
            case "dropbox": {
                FormClass = DropboxArchiveEntryForm;
                break;
            }
            case "owncloud": {
                FormClass = OwnCloudArchiveEntryForm;
                break;
            }

            default:
                throw new Error("Unknown type: " + this.props.params.type);
        }
        return <div>
            <h3>Add from {this.props.params.type} source</h3>
            <FormClass />
            <Link to="/">Home</Link>
        </div>
    }

}

module.exports = AddArchiveEntry;
