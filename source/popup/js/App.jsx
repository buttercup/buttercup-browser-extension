'use strict';

const React = require("react");

const ArchiveList = require("./ArchiveList");
const IconButton = require("./IconButton");
const ConfigureIcon = require("react-icons/lib/fa/cogs");

class App extends React.Component {

    render() {
        return (
            <div>
                <h2 className="green">Buttercup</h2>
                <ArchiveList />
                { this.props.children }
                <IconButton className="configure" onClick={(e) => this.setupClicked(e)}>
                    <ConfigureIcon />
                </IconButton>
            </div>
        );
    }

    setupClicked(event) {
        event.preventDefault();
        chrome.tabs.create({'url': chrome.extension.getURL('setup.html#/')}, function(tab) { });
    }

}

module.exports = App;
