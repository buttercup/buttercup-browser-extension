"use strict";

const React = require("react");
const {
    Link
} = require("react-router");

const ArchiveList = require("./ArchiveList");

class Home extends React.Component {

    render() {
        return <div>
            <h2>Buttercup</h2>
            <ul>
                <li><Link to="/addArchive">Add archive</Link></li>
            </ul>
            <div>
                <h3>Archives</h3>
                <ArchiveList />
            </div>
        </div>
    }

}

module.exports = Home;
