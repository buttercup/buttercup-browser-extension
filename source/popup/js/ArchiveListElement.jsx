'use strict';

const React = require("react");

class ArchiveListElement extends React.Component {

    render() {
        let lockState = (this.props.locked) ?
            `(🔒 locked)` : `(🔓 unlocked)`;
        return (
            <span className="listEl">{this.props.name} {lockState}</span>
        );
    }

}

module.exports = ArchiveListElement;
