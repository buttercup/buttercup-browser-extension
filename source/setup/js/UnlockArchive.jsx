"use strict";

const React = require("react");

const { hashHistory } = require("react-router");

const UnlockArchiveForm = require("./UnlockArchiveForm");
const HeaderBar = require("./HeaderBar");

const NOPE = function() {};

class UnlockArchive extends React.Component {

    onUnlock() {
        switch(this.props.params.action) {
            case "return": {
                hashHistory.goBack();
                break;
            }
            
            default: {
                chrome.tabs.getCurrent(function(tab) {
                    chrome.tabs.remove(tab.id, NOPE);
                });
            }
        }
    }

    render() {
        return <div>
            <HeaderBar />
            <h3>Unlock archive: {this.props.params.name}</h3>
            <UnlockArchiveForm {...this.props.params} onUnlock={() => this.onUnlock()} />
        </div>
    }

}

module.exports = UnlockArchive;
