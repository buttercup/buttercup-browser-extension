import React from "react";

import HeaderBar from "./HeaderBar";
import WebDAVArchiveEntryForm from "./WebDAVArchiveEntryForm";
import DropboxArchiveEntryForm from "./DropboxArchiveEntryForm";
import OwnCloudArchiveEntryForm from "./OwnCloudArchiveEntryForm";

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
        return (
            <div>
                <HeaderBar />
                <h3>Add from {this.props.params.type} source</h3>
                <FormClass />
            </div>
        );
    }

}

export default AddArchiveEntry;
