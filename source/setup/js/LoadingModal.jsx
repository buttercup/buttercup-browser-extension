"use strict";

const React = require("react");

const OUTER_STYLE = {
        position: "fixed",
        top: "0px",
        bottom: "0px",
        right: "0px",
        left: "0px",
        backgroundColor: "#666"
    },
    MESSAGE_STYLE = {
        margin: "auto",
        color: "#EEE",
        fontSize: "30px"
    };

module.exports = class LoadingModal extends React.Component {

    constructor() {
        super();
        this.state = {};
    }

    render() {
        return <div style={OUTER_STYLE}>
            <span style={MESSAGE_STYLE}>Loading...</span>
        </div>
    }

}
