"use strict";

const React = require("react");

const ArchiveList = require("./ArchiveList");
const HeaderBar = require("./HeaderBar");

class Home extends React.Component {

    render() {
        return (
            <div>
                <HeaderBar />
                <div>
                    <h3>Archives</h3>
                    <ArchiveList />
                </div>
            </div>
        );
    }

}

module.exports = Home;
