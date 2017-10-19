import React from "react";

import { hashHistory } from "react-router";

import HeaderBar from "./HeaderBar";

import "AddArchive.sass";

function browseTo(slug) {
    return () => {
        hashHistory.push(`/addArchive/${slug}`);
    };
}

class AddArchive extends React.Component {

    render() {
        return (
            <div>
                <HeaderBar />
                <h3>Add archive from source</h3>
                <ul className="archiveTypeList">
                    <li className="dropbox" onClick={browseTo("dropbox")}>Dropbox</li>
                    <li className="owncloud" onClick={browseTo("owncloud")}>ownCloud</li>
                    <li className="webdav" onClick={browseTo("webdav")}>WebDAV</li>
                </ul>
            </div>
        );
    }

}

export default AddArchive;
