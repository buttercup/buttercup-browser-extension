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

    addArchiveClicked(event) {
        event.preventDefault();
        chrome.tabs.create({'url': chrome.extension.getURL('dist/admin/index.html#/addArchive')}, function(tab) { });
    }

    render() {
        return <div>
            <a href="#" onClick={this.addArchiveClicked}>Add archive</a><br />
            <ul>
                {this.state.archiveNames.map(name => {
                    return <li>{name}</li>
                })}
            </ul>
        </div>
    }

}
