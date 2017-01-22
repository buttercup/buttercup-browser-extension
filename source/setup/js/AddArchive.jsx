"use strict";

const React = require("react");
const { hashHistory } = require("react-router");

const HeaderBar = require("./HeaderBar");

require("AddArchive.sass");


function browseTo(slug) {
    return () => {
        hashHistory.push(`/addArchive/${slug}`);
    };
}

class AddArchive extends React.Component {

    render() {
        return <div>
            <HeaderBar />
            <h3>Add archive from source</h3>
            <ul className="archiveTypeList">
                <li className="dropbox" onClick={browseTo("dropbox")}>Dropbox</li>
                <li className="owncloud" onClick={browseTo("owncloud")}>ownCloud</li>
                <li className="webdav" onClick={browseTo("webdav")}>WebDAV</li>
            </ul>
            <div>
                {this.props.children}
            </div>
        </div>
    }

}

module.exports = AddArchive;
