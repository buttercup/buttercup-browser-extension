import React from "react";
import Spinner from "react-spinner";
import Tree from "rc-tree";

import "rodal/lib/rodal.css";
import "react-spinner/react-spinner.css";
import "rc-tree/assets/index.css";
import "RemoteFileExplorer.sass";

const { TreeNode } = Tree;
const { Component, PropTypes } = React;

function processLeafData(stat) {
    return {
        key: stat.path,
        name: stat.name,
        leaf: stat.isFile()
    };
}

class RemoteFileExplorer extends Component {

    constructor(props) {
        super(props);
        this._fsInstance = this.props.fs || null;
        this.state = {
            active: false,
            dirContents: null,
            fs: null,
            remotePath: "",
            selectedType: "",
            showArchives: this.props.allowSelectArchive === true,
            selectedKeys: []
        };
    }

    get fs() {
        return this.state.fs;
    }

    componentWillReceiveProps(nextProps) {
        let showArchives = nextProps.allowSelectArchive === true,
            newState = {
                active: nextProps.active,
                fs: this.props.fs
            };
        if (this.state.showArchives !== showArchives ||
            (nextProps.active !== true && this.state.dirContents !== null)) {
            Object.assign(newState, {
                dirContents: null,
                showArchives
            });
        }
        this.setState(newState, () => {
            if (this.fs && this.state.active && this.state.dirContents === null) {
                this.fetchDirectory("/");
            }
        });
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.remotePath !== this.state.remotePath) {
            this.props.onChoosePath(nextState.remotePath, nextState.selectedType);
        }
    }

    fetchDirectory(dir) {
        return this.fs
            .readDirectory(dir)
            .then(contents => contents.filter(item => {
                return item.isDirectory() ||
                    (this.state.showArchives && /\.bcup$/i.test(item.name));
            }))
            .then(contents => {
                this.setState({
                    dirContents: Object.assign(this.state.dirContents || {}, {
                        [dir]: contents.map(processLeafData)
                    })
                });
            })
            .catch(err => {
                const error = new Error(`Failed fetching remote directory contents:\n${err.message}`);
                if (this.props.onError) {
                    this.props.onError(error);
                } else {
                    alert(error.message);
                }
            });
    }

    onLoadData(treeNode) {
        let targetPath = treeNode.props.eventKey;
        if (this.state.dirContents[targetPath]) {
            return Promise.resolve();
        }
        return this.fetchDirectory(targetPath);
    }

    onSelect(nodes, event) {
        let selectedKeys = [...nodes];
        const filePath = nodes.shift();
        if (filePath) {
            this.setState({
                remotePath: filePath,
                selectedType: event.node.props.isLeaf ? "file" : "directory",
                selectedKeys
            });
        }
    }

    render() {
        return (
            <div className="explorerContainer">
                {this.state.dirContents === null ?
                    <Spinner /> :
                    this.renderTree()
                }
            </div>
        );
    }

    renderTree() {
        const loopItem = (filePath) => {
            let items = this.state.dirContents[filePath];
            return items.map(item => {
                if (this.state.dirContents[item.key]) {
                    return (
                        <TreeNode
                            title={item.name}
                            key={item.key}
                            >
                            {loopItem(item.key)}
                        </TreeNode>
                    );
                }
                return (
                    <TreeNode
                        title={item.name}
                        key={item.key}
                        isLeaf={item.leaf}
                        />
                );
            });
        };
        const treeNodes = loopItem("/");
        return (
            <Tree
                onSelect={(...args) => this.onSelect(...args)}
                loadData={(node) => this.onLoadData(node)}
                selectedKeys={this.state.selectedKeys}
                >
                {treeNodes}
            </Tree>
        );
    }

}

RemoteFileExplorer.propTypes = {
    allowSelectArchive:     PropTypes.bool,
    fs:                     PropTypes.object,
    onChoosePath:           PropTypes.func,
    onError:                PropTypes.func
};

export default RemoteFileExplorer;
