import React from "react";
import PropTypes from "prop-types";
import IconLocked from "react-icons/lib/fa/lock";
import IconUnlocked from "react-icons/lib/fa/unlock-alt";
import IconConnect from "react-icons/lib/go/key";
import IconDisconnect from "react-icons/lib/go/lock";

import tools from "../../common/tools";

const NOPE = function() {};
const STATUS_LOCKED = "locked";
const STATUS_PENDING = "processing";
const STATUS_UNLOCKED = "unlocked";

class ArchiveListElement extends React.Component {

    get locked() {
        return this.props.status !== STATUS_UNLOCKED;
    }

    get processing() {
        return this.props.status === STATUS_PENDING;
    }

    get type() {
        return tools.niceType(this.props.type);
    }

    render() {
        let actionTitle,
            Icon,
            ControlIcon;
        switch (this.props.status) {
            case STATUS_UNLOCKED:
                Icon = IconUnlocked;
                ControlIcon = IconDisconnect;
                actionTitle = "Lock this archive";
                break;
            case STATUS_PENDING:
                Icon = IconLocked;
                break;
            case STATUS_LOCKED:
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
                    <div className="type">{this.type}</div>
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
                { url: chrome.extension.getURL("setup.html#/unlockArchive/" + encodeURIComponent(this.props.name)) },
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

ArchiveListElement.propTypes = {
    name: PropTypes.string.isRequired,
    onLocked: PropTypes.func,
    status: PropTypes.oneOf([STATUS_LOCKED, STATUS_PENDING, STATUS_UNLOCKED]).isRequired,
    type: PropTypes.string.isRequired
};

ArchiveListElement.defaultProps = {
    onLocked: () => {}
};

export default ArchiveListElement;
