import React from "react";
import Tree from "rc-tree";

import "rc-tree/assets/index.css";

const { TreeNode } = Tree;
const { PropTypes } = React;

const KEY_SEPARATOR = "!!::!!";
const NOPE = function() {};

function closeTab() {
    chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.remove(tab.id, NOPE);
    });
}

function createLeaf(item, parentArchiveID) {
    let archiveID = parentArchiveID || item.archiveID;
    let isArchive = item.hasOwnProperty("archiveID"),
        // key = isArchive ? `!${item.archiveID}` : item.groupID,
        title = item.name || item.title,
        groupID = isArchive ? "0" : item.groupID;
    return (
        <TreeNode
            className={isArchive ? "archive" : "group"}
            title={title}
            key={`${title}${KEY_SEPARATOR}${archiveID}${KEY_SEPARATOR}${groupID}`}
            isLeaf={false}
            >
            {item.groups && item.groups.map(group => createLeaf(group, archiveID))}
        </TreeNode>
    );
}

class ArchiveGroupExplorer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            archives: [],
            archiveID: "",
            groupID: "",
            chosen: "",
            selectedKeys: []
        };
    }

    componentWillMount() {
        this.fetchArchivesAndGroups();
    }

    fetchArchivesAndGroups() {
        chrome.runtime.sendMessage({ command: "archives-and-groups" }, (response) => {
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

    onSelect(nodes) {
        let selectedKeys = [...nodes],
            key = nodes.shift(),
            [title, archiveID, groupID] = key.split(KEY_SEPARATOR);
        if (groupID !== "0") {
            this.setState({
                archiveID,
                groupID,
                chosen: title,
                selectedKeys
            });
            this.props.onSelect(archiveID, groupID);
        }
    }

    render() {
        let treeNodes = this.state.archives.map(archive => createLeaf(archive));
        return (
            <div className="row">
                <Tree
                    onSelect={(...args) => this.onSelect(...args)}
                    selectedKeys={this.state.selectedKeys}
                    >
                    {treeNodes}
                </Tree>
                <div className={(this.state.chosen.length > 0 ? "set" : "unset") + " targetGroup"}>
                    {this.state.chosen.length > 0 ?
                        this.state.chosen :
                        "No group chosen yet"
                    }
                </div>
                <input type="hidden" name="archiveID" value={this.state.archiveID} />
                <input type="hidden" name="groupID" value={this.state.groupID} />
            </div>
        );
    }

}

ArchiveGroupExplorer.propTypes = {
    onSelect: PropTypes.func.isRequired
};

export default ArchiveGroupExplorer;
