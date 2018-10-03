import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import FontAwesome from "react-fontawesome";
import joinPath from "path.join";
import { Tree, Spinner, InputGroup, Colors } from "@blueprintjs/core";

const BCUP_EXTENSION = /\.bcup$/i;
const BUTTERCUP_LOGO_SMALL = require("../../../resources/buttercup-128.png");
const NOOP = () => {};

function LazyType(f) {
    return function __lazyType() {
        return f().apply(this, arguments);
    };
}

function sanitiseFilename(filename) {
    let output = filename.trim();
    if (BCUP_EXTENSION.test(output) !== true) {
        output += ".bcup";
    }
    return output;
}

const LazyDirectoryShape = LazyType(() => DirectoryShape);
const FileShape = PropTypes.shape({
    path: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
});
const DirectoryShape = PropTypes.shape({
    path: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    directories: PropTypes.arrayOf(LazyDirectoryShape).isRequired,
    files: PropTypes.arrayOf(FileShape).isRequired
});

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-content: stretch;
    margin-bottom: 20px;
    overflow-y: scroll;
`;
const ItemNewText = styled.div`
    font-style: italic;
    color: ${p => (p.selected ? "#fff" : Colors.GRAY1)};
    cursor: text;
`;
const NewFilenameInput = styled.input`
    border: none;
    width: 100%;
    font-size: inherit;
    background-color: transparent;
    outline: none;
`;
const SpinnerIconWrapper = styled.span`
    margin-right: 7px;
`;

const SpinnerIcon = () => (
    <SpinnerIconWrapper>
        <Spinner size={16} />
    </SpinnerIconWrapper>
);

class RemoteFileTree extends Component {
    static propTypes = {
        directoriesLoading: PropTypes.arrayOf(PropTypes.string).isRequired,
        onCreateRemotePath: PropTypes.func.isRequired,
        onOpenDirectory: PropTypes.func.isRequired,
        onSelectRemotePath: PropTypes.func.isRequired,
        rootDirectory: DirectoryShape,
        selectedFilename: PropTypes.string,
        selectedFilenameNeedsCreation: PropTypes.bool.isRequired
    };

    static defaultProps = {
        onCreateRemotePath: NOOP,
        onOpenDirectory: NOOP,
        onSelectRemotePath: NOOP,
        selectedFilenameNeedsCreation: false
    };

    state = {
        editingNewFile: false,
        editingNewFileDirectory: null,
        editingNewFileName: "",
        openDirectories: ["/"]
    };

    handleFileClick(fileItem) {
        if (!fileItem) {
            return;
        }
        this.setState({
            editingNewFile: false,
            editingNewFileDirectory: null,
            editingNewFileName: ""
        });
        this.props.onSelectRemotePath(fileItem.path);
    }

    handleNewItemFinishedEditing() {
        const { editingNewFileName } = this.state;
        const filename = sanitiseFilename(editingNewFileName);
        this.setState({
            editingNewFile: false,
            editingNewFileName: filename
        });
        this.props.onCreateRemotePath(joinPath(this.state.editingNewFileDirectory, filename));
    }

    onNewFilenameChange(event) {
        const { value } = event.target;
        this.setState({
            editingNewFileName: value
        });
    }

    onBlurNewItem() {
        this.handleNewItemFinishedEditing();
    }

    onEditNewItem(directoryParent) {
        const { editingNewFileDirectory } = this.state;
        const resetState =
            editingNewFileDirectory === directoryParent
                ? {}
                : // Directories not the same, so clear the filename:
                  { editingNewFileName: "" };
        this.setState({
            ...resetState,
            editingNewFile: true,
            editingNewFileDirectory: directoryParent
        });
        setTimeout(() => {
            if (this._newFilenameInput) {
                this._newFilenameInput.focus();
            }
        }, 200);
    }

    onNewItemKeyPress(event) {
        if (event.key === "Enter") {
            this.handleNewItemFinishedEditing();
        }
    }

    handleNodeExpand({ nodeData }) {
        this.setState({
            openDirectories: [...this.state.openDirectories, nodeData.path]
        });
        this.props.onOpenDirectory(nodeData.path);
    }

    handleNodeCollapse({ nodeData }) {
        this.setState({
            openDirectories: this.state.openDirectories.filter(dir => dir !== nodeData.path)
        });
    }

    getTreeNewItem(parentPath) {
        const { editingNewFile, editingNewFileDirectory, editingNewFileName } = this.state;
        const currentlyEditingThis = editingNewFileDirectory === parentPath && editingNewFileName.length > 0;
        const isSelected =
            currentlyEditingThis &&
            joinPath(editingNewFileDirectory, editingNewFileName) === this.props.selectedFilename;
        console.log(this.state);
        const label = (
            <Choose>
                <When condition={editingNewFileDirectory === parentPath && editingNewFile}>
                    <NewFilenameInput
                        type="text"
                        value={editingNewFileName}
                        onChange={::this.onNewFilenameChange}
                        onBlur={::this.onBlurNewItem}
                        onKeyPress={::this.onNewItemKeyPress}
                        innerRef={input => {
                            this._newFilenameInput = input;
                        }}
                    />
                </When>
                <Otherwise>
                    <ItemNewText selected={isSelected} onClick={() => this.onEditNewItem(parentPath)}>
                        <Choose>
                            <When condition={currentlyEditingThis}>{editingNewFileName}</When>
                            <Otherwise>Enter new archive name...</Otherwise>
                        </Choose>
                    </ItemNewText>
                </Otherwise>
            </Choose>
        );
        return {
            id: "new-vault-file",
            icon: "plus",
            label,
            isSelected
        };
    }

    getTree(directory, isDir = true) {
        return {
            id: directory.path,
            label: directory.name,
            isExpanded: this.state.openDirectories.includes(directory.path),
            isSelected: directory.path === this.props.selectedFilename,
            hasCaret: isDir,
            icon: isDir ? "folder-close" : "document",
            nodeData: directory,
            childNodes: this.props.directoriesLoading.includes(directory.path)
                ? [
                      {
                          id: "loading" + Math.random().toString(),
                          label: "Loading",
                          icon: <SpinnerIcon />
                      }
                  ]
                : [
                      ...(directory.directories || []).map(dir => this.getTree(dir)),
                      ...(directory.files || []).map(dir => this.getTree(dir, false)),
                      this.getTreeNewItem(directory.path)
                  ]
        };
    }

    render() {
        return (
            <Choose>
                <When condition={!!this.props.rootDirectory}>
                    <Tree
                        contents={this.getTree(this.props.rootDirectory).childNodes}
                        onNodeExpand={::this.handleNodeExpand}
                        onNodeCollapse={::this.handleNodeCollapse}
                        onNodeClick={({ nodeData }) => this.handleFileClick(nodeData)}
                    />
                </When>
                <Otherwise>
                    <SpinnerIcon />
                </Otherwise>
            </Choose>
        );
    }
}

export default RemoteFileTree;
