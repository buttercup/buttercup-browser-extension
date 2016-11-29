'use strict';

const React = require("react");

const {
    Link
} = require("react-router");

class AddArchive extends React.Component {

    render() {
        return <div>
            <h3>Archive source</h3>
            <ul>
                <li>WebDAV</li>
            </ul>
            <Link to="/">Home</Link>
        </div>
    }

}

module.exports = AddArchive;
