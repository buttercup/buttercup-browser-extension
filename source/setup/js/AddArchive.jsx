"use strict";

const React = require("react");

const {
    Link
} = require("react-router");
const HeaderBar = require("./HeaderBar");

class AddArchive extends React.Component {

    render() {
        return <div>
            <HeaderBar />
            <h3>Add archive from source</h3>
            <ul>
                <li><Link to="/addArchive/dropbox">Dropbox</Link></li>
                <li><Link to="/addArchive/owncloud">ownCloud</Link></li>
                <li><Link to="/addArchive/webdav">WebDAV</Link></li>
            </ul>
            <div>
                {this.props.children}
            </div>
        </div>
    }

}

module.exports = AddArchive;
