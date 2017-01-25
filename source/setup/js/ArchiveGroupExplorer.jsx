import React from "react";
// import ArchiveGroupExplorerNode from "./ArchiveGroupExplorerNode";
import Tree from "rc-tree";

import "rc-tree/assets/index.css";

const { TreeNode } = Tree;

const KEY_SEPARATOR = "!!::!!";
const NOPE = function() {};

function closeTab() {
    chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.remove(tab.id, NOPE);
    });
}

function createLeaf(item) {
    let isArchive = item.hasOwnProperty("archiveID"),
        key = isArchive ? `!${item.archiveID}` : item.groupID,
        title = item.name || item.title;
    return (
        <TreeNode
            className={isArchive ? "archive" : "group"}
            title={title}
            key={`${key}${KEY_SEPARATOR}${title}`}
            isLeaf={false}
            >
            {item.groups && item.groups.map(createLeaf)}
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
            chosenTitle: "",
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
            [id, title] = key.split(KEY_SEPARATOR);
        if (/^[^!]/.test(id)) {
            this.setState({
                chosen: id,
                chosenTitle: title,
                selectedKeys
            });
        }
    }

    render() {
        let treeNodes = this.state.archives.map(archive => createLeaf(archive));
        return <div>
            <Tree
                onSelect={(...args) => this.onSelect(...args)}
                selectedKeys={this.state.selectedKeys}
                >
                {treeNodes}
            </Tree>
            <label>
                Target group:
                <input type="text" name="chosenTitle" value={this.state.chosenTitle} readOnly />
            </label>
            <input type="hidden" name="archiveID" value={this.state.archiveID} />
            <input type="hidden" name="groupID" value={this.state.groupID} />
        </div>;
    }

}

export default ArchiveGroupExplorer;
