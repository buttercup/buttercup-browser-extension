import React from "react";
import ArchiveGroupExplorerNode from "./ArchiveGroupExplorerNode";

const NOPE = function() {};

function closeTab() {
    chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.remove(tab.id, NOPE);
    });
}

class ArchiveGroupExplorer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            archives: [],
            archiveID: "",
            groupID: "",
            chosen: ""
        };
    }

    componentWillMount() {
        this.fetchArchivesAndGroups();
    }

    fetchArchivesAndGroups() {
        chrome.runtime.sendMessage({ command: "archives-and-groups" }, (response) => {
            console.log("RESP", response);
            if (response && response.ok === true) {
                this.setState({
                    archives: response.archives 
                });
            } else {
                alert("There was an error fetching archives:\n" + response.error);
                closeTab();
            }
        });
    }

    onSelect(itemDetails) {
        this.setState({
            chosen: itemDetails.title,
            archiveID: itemDetails.archiveID,
            groupID: itemDetails.id
        });
        if (this.props.onSelect) {
            this.props.onSelect(itemDetails.archiveID, itemDetails.id);
        }
    }

    render() {
        let archives = this.state.archives.map(archive =>
            <ArchiveGroupExplorerNode key={archive.archiveID} {...archive} onSelect={this.onSelect.bind(this)} />
        );
        return <div>
            {archives}
            <label>
                Target group:
                <input type="text" name="chosen" value={this.state.chosen} readOnly />
            </label>
            <input type="hidden" name="archiveID" value={this.state.archiveID} />
            <input type="hidden" name="groupID" value={this.state.groupID} />
        </div>;
    }

}

export default ArchiveGroupExplorer;
