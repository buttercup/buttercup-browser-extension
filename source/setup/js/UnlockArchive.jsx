"use strict";

const React = require("react");

const {
    Link
} = require("react-router");

const UnlockArchiveForm = require("./UnlockArchiveForm");

class UnlockArchive extends React.Component {

    render() {
        return <div>
            <h3>Unlock archive: {this.props.params.name}</h3>
            <UnlockArchiveForm {...this.props.params} />
        </div>
    }

}

module.exports = UnlockArchive;
