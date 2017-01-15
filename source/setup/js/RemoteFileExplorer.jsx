"use strict";

const React = require("react");
const Rodal = require("rodal").default;
const Spinner = require("react-spinner");
const Tree = require("rc-tree");
const { TreeNode } = Tree;

require("rodal/lib/rodal.css");
require("react-spinner/react-spinner.css");
require("rc-tree/assets/index.css");
require("RemoteFileExplorer.sass");

function processLeafData(stat) {
    return {
        key: stat.path,
        name: stat.name,
        leaf: stat.isFile()
    };
}

class RemoteFileExplorer extends React.Component {

    constructor(props) {
        super(props);
        this._fsInstance = this.props.fs || null;
        this.state = {
            allowSelectArchive: true,
            createNew: false,
            dirContents: null,
            modalVisible: false,
            remotePath: "",
            selectedKeys: []
        };
    }

    get fs() {
        return this.props.fs;
    }

    componentWillReceiveProps() {
        if (this.fs && this.state.dirContents === null) {
            this.fetchDirectory("/");
        }
    }

    fetchDirectory(dir) {
        return this.fs
            .readDirectory(dir)
            .then(contents => contents.filter(item => {
                return item.isDirectory() ||
                    (this.state.allowSelectArchive && /\.bcup$/i.test(item.name));
            }))
            .then(contents => {
                console.log("Remote contents", dir, contents);
                this.setState({
                    dirContents: Object.assign(this.state.dirContents || {}, {
                        [dir]: contents.map(processLeafData)
                    })
                });
            })
            .catch(err => {
                alert(`An error occurred fetching Dropbox contents: ${err.message}`);
                throw err;
            });
    }

    hide() {
        this.setState({ modalVisible: false });
    }

    onLoadData(treeNode) {
        let targetPath = treeNode.props.eventKey;
        if (this.state.dirContents[targetPath]) {
            return Promise.resolve();
        } else {
            return this.fetchDirectory(targetPath);
        }
    }

    onSelect(nodes) {
        let selectedKeys = [...nodes];
        const filePath = nodes.shift();
        if (filePath) {
            this.setState({
                remotePath: filePath,
                selectedKeys
            });
        }
    }

    render() {
        return (
            <div>
                <button onClick={(e) => this.show(e)}>Browse</button>
                <Rodal visible={this.state.modalVisible} onClose={() => this.hide()}>
                    <div className="modalContents">
                        {this.state.dirContents === null ?
                            <Spinner /> :
                            this.renderTree()
                        }
                    </div>
                </Rodal>
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
                onSelect={(nodes) => this.onSelect(nodes)}
                loadData={(node) => this.onLoadData(node)}
                selectedKeys={this.state.selectedKeys}
                >
                {treeNodes}
            </Tree>
        );
    }

    show(e) {
        e.preventDefault();
        this.setState({ modalVisible: true });
    }

}

module.exports = RemoteFileExplorer;
