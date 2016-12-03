'use strict';

const React = require("react");

class ArchiveListElement extends React.Component {

    render() {
        return (
            <span>{this.props.name}</span>
        );
    }

}

module.exports = ArchiveListElement;
