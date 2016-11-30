"use strict";

const React = require("react");

class ArchiveEntryForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        let input = event.target,
            name = input.getAttribute("name"),
            value = input.value;
        this.state[name] = value;
    }

    handleSubmit(event) {
        event.preventDefault();
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
            <input type="password" name="master_password" value={this.state.master_password} onChange={this.handleChange} />
        </label>
    }

}

module.exports = ArchiveEntryForm;
