"use strict";

const React = require("react");
const { hashHistory } = require("react-router");

const IconLocked = require("react-icons/lib/fa/lock");
const IconUnlocked = require("react-icons/lib/fa/unlock-alt");
const IconConnect = require("react-icons/lib/go/key");
const IconDisconnect = require("react-icons/lib/go/lock");
const IconRemove = require("react-icons/lib/go/x");

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

    onRemoveArchiveClicked(e, archive) {
        e.preventDefault();
        if (window.confirm(`Are you sure you want to remove "${archive.name}"?`)) { 
            chrome.runtime.sendMessage({ command: "remove-archive", name: archive.name }, (response) => {
                if (response && response.ok) {
                    this.fetchArchives();
                } else {
                    alert("Failed removing archive");
                }
            });
        }
    }

    onToggleLockClicked(e, archive) {
        e.preventDefault();
        if (archive.status === "locked") {
            // unlock
            hashHistory.push("/unlockArchive/" + encodeURIComponent(archive.name) + "/return");
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
                                onClick={(e) => this.onToggleLockClicked(e, archive)}
                                />
                        }
                    </div>
                    <div className="remove" title="Remove archive">
                        <IconRemove 
                            className="icon"
                            onClick={(e) => this.onRemoveArchiveClicked(e, archive)}
                            />
                    </div>
                </li>
            )
        });
        return (
            <div>
                <ul className="archiveList">
                    {archives}
                </ul>
                {archives.length === 0 &&
                    <div className="noArchives">No archives yet.</div>    
                }
            </div>
        );
    }

}

module.exports = ArchiveList;
