'use strict';

const React = require("react");

const {
    Link
} = require("react-router");

class NoMatch extends React.Component {

    render() {
        return <div>
            <h3>Bad link</h3>
            <Link to="/">Return home</Link>
        </div>
    }

}

module.exports = NoMatch;
