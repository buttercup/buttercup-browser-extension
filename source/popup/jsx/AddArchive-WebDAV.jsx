'use strict';

const React = require("react"),
    Link = require("react-router").Link;

module.exports = React.createClass({

    handleSubmit: function(event) {
        event.preventDefault();
        console.log("submit", event);
        window.BC.archives.add.webDAV({test:true});
    },

    render: function() {
        return <div>
            <h3>Add webDAV archive</h3>
            <form onSubmit={this.handleSubmit}>
                <input type="text" name="address" placeholder="WebDAV address" /><br />
                <input type="text" name="webdav_username" placeholder="WebDAV username" /><br />
                <input type="password" name="webdav_password" placeholder="WebDAV password" /><br />
                <br />
                <input type="text" name="username" placeholder="Archive username" /><br />
                <input type="password" name="password" placeholder="Archive username" /><br />
                <br />
                <input type="submit" value="Fetch" />
            </form>
        </div>
    }

});
