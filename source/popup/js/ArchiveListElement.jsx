'use strict';

const React = require("react");
const IconLocked = require("react-icons/lib/fa/lock");
const IconUnlocked = require("react-icons/lib/fa/unlock-alt");
const IconConnect = require("react-icons/lib/fa/sign-in");
const IconDisconnect = require("react-icons/lib/fa/sign-out");

const NOPE = function() {};

class ArchiveListElement extends React.Component {

    render() {
        let canUnlock = false,
            type = "Dropbox",
            Icon,
            ControlIcon;
        switch (this.props.status) {
            case "unlocked":
                Icon = IconUnlocked;
                ControlIcon = IconDisconnect;
                break;
            case "processing":
                Icon = IconLocked;
                break;
            case "locked":
                canUnlock = true;
                /* falls through */
            default:
                Icon = IconLocked;
                ControlIcon = IconConnect;
                break;
        }
        return (
            <li className="listEl">
                <div className={this.props.status + " status"}><Icon className="lockIcon" /></div>
                <div className="name">
                    <div className="title">{this.props.name}</div>
                    <div className="type">{type}</div>
                </div>
                <div className="control">
                    {ControlIcon &&
                        <ControlIcon
                            className={this.props.status + " icon"}
                            onClick={(e) => this.unlockClicked(e)}
                            />
                    }
                </div>
            </li>
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
