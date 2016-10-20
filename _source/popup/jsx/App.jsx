'use strict';

const React = require("react"),
    Link = require("react-router").Link;

module.exports = React.createClass({
    render: function(){
        return <div>
            <h2>Buttercup</h2>
            {this.props.children}
        </div>
    }
});
