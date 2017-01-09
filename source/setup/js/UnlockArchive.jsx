"use strict";

const React = require("react");

const UnlockArchiveForm = require("./UnlockArchiveForm");
const HeaderBar = require("./HeaderBar");

class UnlockArchive extends React.Component {

    render() {
        return <div>
            <HeaderBar />
            <h3>Unlock archive: {this.props.params.name}</h3>
            <UnlockArchiveForm {...this.props.params} />
        </div>
    }

}

module.exports = UnlockArchive;
