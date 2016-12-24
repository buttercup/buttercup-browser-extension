'use strict';

const React = require("react");

const NOPE = function() {};

class ArchiveListElement extends React.Component {

    render() {
        let lockState,
            canUnlock = false;
        switch (this.props.status) {
            case "unlocked":
                lockState = `(🔓 unlocked)`;
                break;
            case "processing":
                lockState = `(🔐 pending)`;
            case "locked":
                canUnlock = true;
                /* falls through */
            default:
                lockState = `(🔒 locked)`;
                break;
        }
        console.log("props", this.props);
        return (
            <div>
                <span className="listEl">{this.props.name} {lockState} </span>
                {canUnlock && <a className="unlockArchive" href="#" onClick={(e) => this.unlockClicked(e)}>Unlock</a>}
            </div>
        );
    }

    unlockClicked(e) {
        e.preventDefault();
        chrome.tabs.create(
            { "url": chrome.extension.getURL("setup.html#/unlockArchive/" + encodeURIComponent(this.props.name)) },
            NOPE
        );
    }

}

module.exports = ArchiveListElement;
