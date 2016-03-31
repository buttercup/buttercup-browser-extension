'use strict';

const React = require("react"),
    Link = require("react-router").Link;

const App = React.createClass({
    render: function(){
        return <div>
            <h2>Buttercup</h2>
            {this.props.children}
        </div>
    }
});

// App.contextTypes = {
//     router: React.PropTypes.object.isRequired,
// };

module.exports = App;
