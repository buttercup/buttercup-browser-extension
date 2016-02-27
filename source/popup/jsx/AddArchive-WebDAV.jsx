'use strict';

const React = require("react"),
    Link = require("react-router").Link;

module.exports = React.createClass({

    getInitialState: function() {
        return {
            webdav_address: "",
            webdav_username: "",
            webdav_password: "",
            webdav_path: "/test/webdav-test.bcup",
            archive_password: ""
        };
    },

    handleChange: function(event) {
        let state = this.state;
        state[event.target.name] = event.target.value;
        this.setState(state);
    },

    handleSubmit: function(event) {
        event.preventDefault();
        let state = this.state;
        window.BC.addArchive.webDAV({
            remote_address: state.webdav_address,
            remote_username: state.webdav_username,
            remote_password: state.webdav_password,
            remote_path: state.webdav_path,
            password: state.archive_password
        });
    },

    render: function() {
        return <div>
            <h3>Add webDAV archive</h3>
            <form onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    name="webdav_address"
                    placeholder="WebDAV address"
                    value={this.state.webdav_address}
                    onChange={this.handleChange}
                />
                <br />
                <input
                    type="text"
                    name="webdav_username"
                    placeholder="WebDAV username"
                    value={this.state.webdav_username}
                    onChange={this.handleChange}
                />
                <br />
                <input
                    type="password"
                    name="webdav_password"
                    placeholder="WebDAV password"
                    value={this.state.webdav_password}
                    onChange={this.handleChange}
                />
                <br />
                <input
                    type="text"
                    name="webdav_path"
                    placeholder="Archive path"
                    value={this.state.webdav_path}
                    onChange={this.handleChange}
                />
                <br /><br />
                <input
                    type="password"
                    name="archive_password"
                    placeholder="Archive password"
                    value={this.state.archive_password}
                    onChange={this.handleChange}
                />
                <br /><br />
                <input type="submit" value="Fetch" />
            </form>
        </div>
    }

});
