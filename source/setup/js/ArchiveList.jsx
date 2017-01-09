"use strict";

const React = require("react");
const { hashHistory } = require("react-router");

const IconLocked = require("react-icons/lib/fa/lock");
const IconUnlocked = require("react-icons/lib/fa/unlock-alt");
const IconConnect = require("react-icons/lib/go/key");
const IconDisconnect = require("react-icons/lib/go/lock");

require("ArchiveList.sass");

class ArchiveList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            archives: []
        };
    }

    componentWillMount() {
        this.fetchArchives();
    }

    fetchArchives() {
        chrome.runtime.sendMessage({ command: "get-archive-states" }, (response) => {
            this.onArchivesUpdate(response);
        });
    }

    onArchivesUpdate(archives) {
        this.setState({ archives });
    }

    render() {
        let archives = this.state.archives.map(archive => {
            let canUnlock = false,
                type = "Dropbox",
                actionTitle,
                Icon,
                ControlIcon;
            switch (archive.status) {
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
                <li key={archive.name}>
                    <div className={archive.status + " status"}><Icon className="lockIcon" /></div>
                    <div className="name">
                        <div className="title">{archive.name}</div>
                        <div className="type">{type}</div>
                    </div>
                    <div className="control" title={actionTitle}>
                        {ControlIcon &&
                            <ControlIcon
                                className={archive.status + " icon"}
                                onClick={(e) => this.toggleLockClicked(e, archive)}
                                />
                        }
                    </div>
                </li>
            )
        });
        return (
            <ul className="archiveList">
                {archives}
            </ul>
        );
    }

    toggleLockClicked(e, archive) {
        e.preventDefault();
        if (archive.status === "locked") {
            // unlock
            hashHistory.push("/unlockArchive/" + encodeURIComponent(archive.name));
        } else if (archive.status === "unlocked") {
            // lock
            chrome.runtime.sendMessage({ command: "lock-archive", name: archive.name }, (response) => {
                if (response && response.ok) {
                    this.fetchArchives();
                } else {
                    alert("Failed locking archive");
                }
            });
        }
    }

}

module.exports = ArchiveList;
