'use strict';

const React = require("react");
const IconLocked = require("react-icons/lib/fa/lock");
const IconUnlocked = require("react-icons/lib/fa/unlock-alt");
const IconConnect = require("react-icons/lib/go/key");
const IconDisconnect = require("react-icons/lib/go/lock");

const NOPE = function() {};

class ArchiveListElement extends React.Component {

    get locked() {
        return this.props.status !== "unlocked";
    }

    get processing() {
        return this.props.status === "processing";
    }

    render() {
        let canUnlock = false,
            type = "Dropbox",
            actionTitle,
            Icon,
            ControlIcon;
        switch (this.props.status) {
            case "unlocked":
                Icon = IconUnlocked;
                ControlIcon = IconDisconnect;
                actionTitle = "Lock this archive";
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
                actionTitle = "Unlock this archive";
                break;
        }
        return (
            <li className="listEl">
                <div className={this.props.status + " status"}><Icon className="lockIcon" /></div>
                <div className="name">
                    <div className="title">{this.props.name}</div>
                    <div className="type">{type}</div>
                </div>
                <div className="control" title={actionTitle}>
                    {ControlIcon &&
                        <ControlIcon
                            className={this.props.status + " icon"}
                            onClick={(e) => this.toggleLockClicked(e)}
                            />
                    }
                </div>
            </li>
        );
    }

    toggleLockClicked(e) {
        e.preventDefault();
        if (this.locked && this.processing !== true) {
            // unlock
            chrome.tabs.create(
                { "url": chrome.extension.getURL("setup.html#/unlockArchive/" + encodeURIComponent(this.props.name)) },
                NOPE
            );
        } else if (this.locked === false) {
            // lock
            Buttercup
                .lockArchive(this.props.name)
                .then(() => {
                    if (this.props.onLocked) {
                        this.props.onLocked();
                    }
                })
                .catch(function(err) {
                    alert("Failed locking archive: " + err.message);
                });
        }
    }

}

module.exports = ArchiveListElement;
