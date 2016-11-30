"use strict";

const React = require("react");

class ArchiveEntryForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        console.log("Change", this, event);
    }

    handleSubmit(event) {
        console.log("Submit", this, event);
    }

    render() {
        return <form>
            {this.renderFormContents()}
            <input type="submit" name="Authenticate" onClick={this.handleSubmit} />
        </form>
    }

    renderFormContents() {
        return <label>
            Master password:
            <input type="password" name="master-password" value="" onChange={this.handleChange} />
        </label>
    }

}

module.exports = ArchiveEntryForm;
