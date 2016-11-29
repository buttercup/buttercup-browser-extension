'use strict';

const React = require("react");

const {
    Link
} = require("react-router");

class MainMenu extends React.Component {

    render() {
        return <div>
            <h2>Buttercup</h2>
            <ul>
                <li><Link to="/addArchive">Add archive</Link></li>
            </ul>
        </div>
    }

}

module.exports = MainMenu;
