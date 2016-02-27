'use strict';

const React = require("react"),
    Link = require("react-router").Link;

module.exports = React.createClass({
    render: function(){
        return <div>
            <Link to="/addArchive">Add archive</Link>
        </div>
    }
});
