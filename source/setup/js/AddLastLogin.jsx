"use strict";

const React = require("react");

const AddLastLoginForm = require("./AddLastLoginForm");

class UnlockArchive extends React.Component {

    render() {
        return <div>
            <h3>Add new entry</h3>
            <AddLastLoginForm />
        </div>
    }

}

module.exports = UnlockArchive;
