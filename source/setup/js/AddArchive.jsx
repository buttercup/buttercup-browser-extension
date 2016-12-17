"use strict";

const React = require("react");

const {
    Link
} = require("react-router");

class AddArchive extends React.Component {

    render() {
        return <div>
            <h3>Add archive from source</h3>
            <ul>
                <li><Link to="/addArchive/webdav">WebDAV</Link></li>
            </ul>
            <div>
                {this.props.children}
            </div>
            <Link to="/">Home</Link>
        </div>
    }

}

module.exports = AddArchive;
