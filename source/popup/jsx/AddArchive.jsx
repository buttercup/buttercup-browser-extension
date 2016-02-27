'use strict';

const React = require("react"),
    Link = require("react-router").Link;

module.exports = React.createClass({
    render: function(){
        return <div>
            <h3>Add archive</h3>
            <Link to="/addArchive/webdav">WebDAV</Link>
        </div>
    }
});
