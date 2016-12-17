'use strict';

const React = require("react");

const ArchiveList = require("./ArchiveList");

class App extends React.Component {

    render() {
        return (
            <div>
                <h2>Buttercup</h2>
                <ArchiveList />
                <a href="#" onClick={(e) => this.setupClicked(e)}>Setup</a>
                { this.props.children }
            </div>
        );
    }

    setupClicked(event) {
        event.preventDefault();
        chrome.tabs.create({'url': chrome.extension.getURL('dist/setup.html#/')}, function(tab) { });
    }

}

module.exports = App;
