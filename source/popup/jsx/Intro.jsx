'use strict';

const React = require("react"),
    Link = require("react-router").Link;

module.exports = class Intro extends React.Component {

    constructor() {
        super();
        this.state = {
            archiveNames: []
        };

        window.BC.getArchiveNames()
            .then(names => {
                this.setState({archiveNames: names});
            })
            .catch(err => {
                throw err;
            });
    }

    render() {
        return <div>
            <Link to="/addArchive">Add archive</Link>
            <ul>
                {this.state.archiveNames.map(name => {
                    return <li>{name}</li>
                })}
            </ul>
        </div>
    }

}
