/** @jsx React.DOM */
'use strict'
var React = require("react"),
    Link = require("react-router").Link;

module.exports = React.createClass({
    render: function(){
        return <div>
            <h2>Buttercup</h2>
            <Link to="/addArchive">Add archive</Link>
        </div>
    }
});
