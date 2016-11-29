"use strict";

const React = require("react");

class ArchiveEntryForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        console.log("Change", event);
    }

    render() {
        return <form>
            <label>
                Master password:
                <input type="password" name="master-password" value="" onChange={this.handleChange} />
            </label>
        </form>
    }

}

module.exports = ArchiveEntryForm;
