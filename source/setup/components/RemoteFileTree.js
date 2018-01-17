import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import FontAwesome from "react-fontawesome";
import joinPath from "path.join";

const BCUP_EXTENSION = /\.bcup$/i;
const BUTTERCUP_LOGO_SMALL = require("../../../resources/buttercup-128.png");
const EXPAND_SPACE_AFTER = 4;
const NOOP = () => {};
const ROW_SIZE_UNIT = 26;

function LazyType(f) {
    return function __lazyType() {
        return f().apply(this, arguments);
    };
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
const ItemRow = styled.div`
    margin-left: ${props => (props.depth ? props.depth * ROW_SIZE_UNIT : 0)}px;
    height: ${ROW_SIZE_UNIT}px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    background-color: ${props => (props.selected ? "rgba(0, 183, 172, 0.2)" : "inherit")};
`;
const ExpandBox = styled.div`
    width: ${ROW_SIZE_UNIT}px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => (props.isFile ? "#ddd" : "rgba(0, 183, 172, 1)")};
    color: #fff;
    margin-right: ${EXPAND_SPACE_AFTER}px;
    cursor: ${props => (props.isFile ? "default" : "pointer")};
`;
const ExpandBoxBCUP = styled(ExpandBox)`
    background-image: url(${BUTTERCUP_LOGO_SMALL});
    background-size: 26px;
    background-position: 50% 50%;
`;
const ItemIcon = styled.div`
    width: ${ROW_SIZE_UNIT}px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => (props.isFile ? "#b2b2b2" : "#f2ac09")};
    font-size: 18px;
    margin-right: 4px;
`;
const ItemIconNewFile = ItemIcon.extend`
    color: ${props => (props.highlight === true ? "rgba(0, 183, 172, 1)" : "rgb(120, 120, 120)")};
`;
const ItemText = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    font-style: ${props => (props.selected ? "italic" : "normal")};
    color: rgb(72, 72, 72);
    cursor: pointer;
`;
const ItemNewText = ItemText.extend`
    font-style: italic;
    color: rgb(120, 120, 120);
    cursor: text;
`;
const LoaderIconContainer = styled.div`
    width: ${ROW_SIZE_UNIT}px;
    height: ${ROW_SIZE_UNIT}px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #888;
    margin-left: ${EXPAND_SPACE_AFTER}px;
`;
const NewFilenameInput = styled.input`
    border: none;
    height: ${ROW_SIZE_UNIT}px;
    width: 200px;
    backgroundcolor: #ddd;
`;

function sanitiseFilename(filename) {
    let output = filename.trim();
    if (BCUP_EXTENSION.test(output) !== true) {
        output += ".bcup";
    }
    return output;
}

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

    handleExpansionClick(item) {
        const { path } = item;
        if (this.state.openDirectories.includes(path)) {
            // close
            this.setState({
                openDirectories: this.state.openDirectories.filter(dir => dir !== path)
            });
        } else {
            // open
            this.setState({
                openDirectories: [...this.state.openDirectories, path]
            });
            this.props.onOpenDirectory(path);
        }
    }

    handleFileClick(fileItem) {
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

    render() {
        return (
            <Container>
                <Choose>
                    <When condition={!!this.props.rootDirectory}>{this.renderDirectory(this.props.rootDirectory)}</When>
                    <Otherwise>
                        <If condition={this.props.directoriesLoading.includes("/")}>{this.renderLoader("/", 1)}</If>
                    </Otherwise>
                </Choose>
            </Container>
        );
    }

    renderDirectory(dir, depth = 0) {
        const isOpen = this.state.openDirectories.includes(dir.path);
        const isLoading = this.props.directoriesLoading.includes(dir.path);
        const name = dir.name.trim().length > 0 ? dir.name : "/";
        const thisItem = (
            <ItemRow depth={depth} key={dir.path}>
                <ExpandBox onClick={() => this.handleExpansionClick(dir)}>
                    <Choose>
                        <When condition={isOpen}>
                            <FontAwesome name="minus" />
                        </When>
                        <Otherwise>
                            <FontAwesome name="plus" />
                        </Otherwise>
                    </Choose>
                </ExpandBox>
                <ItemIcon isFile={false}>
                    <FontAwesome name="folder" />
                </ItemIcon>
                <ItemText onClick={() => this.handleExpansionClick(dir)}>{name}</ItemText>
            </ItemRow>
        );
        const allItems = [null];
        if (isOpen) {
            // Directory is open, so add children
            allItems.push(...dir.directories);
        }
        return [
            <For each="directory" of={allItems}>
                <Choose>
                    <When condition={directory === null}>{thisItem}</When>
                    <Otherwise>{this.renderDirectory(directory, depth + 1)}</Otherwise>
                </Choose>
            </For>,
            isOpen ? this.renderFiles(dir, depth + 1) : null,
            isOpen && isLoading ? this.renderLoader(dir.path, depth + 1) : null,
            isOpen ? this.renderNewItem(dir.path, depth + 1) : null
        ];
    }

    renderFiles(dir, depth = 0) {
        return (
            <For each="file" of={dir.files}>
                <ItemRow depth={depth} key={file.path} selected={file.path === this.props.selectedFilename}>
                    <Choose>
                        <When condition={/\.bcup$/i.test(file.name)}>
                            <ExpandBoxBCUP isFile={true} />
                        </When>
                        <Otherwise>
                            <ExpandBox isFile={true} />
                        </Otherwise>
                    </Choose>
                    <ItemIcon isFile={true}>
                        <FontAwesome name="file" />
                    </ItemIcon>
                    <ItemText
                        onClick={() => this.handleFileClick(file)}
                        selected={file.path === this.props.selectedFilename}
                    >
                        {file.name}
                    </ItemText>
                </ItemRow>
            </For>
        );
    }

    renderLoader(parentPath, depth = 0) {
        return (
            <ItemRow depth={depth} key={`loader:${parentPath}`}>
                <LoaderIconContainer>
                    <FontAwesome name="repeat" spin />
                </LoaderIconContainer>
            </ItemRow>
        );
    }

    renderNewItem(parentPath, depth = 0) {
        const { editingNewFile, editingNewFileDirectory, editingNewFileName } = this.state;
        const currentlyEditingThis = editingNewFileDirectory === parentPath && editingNewFileName.length > 0;
        const selectedThis =
            currentlyEditingThis &&
            joinPath(editingNewFileDirectory, editingNewFileName) === this.props.selectedFilename;
        return (
            <ItemRow depth={depth} key={`new:${parentPath}`} selected={selectedThis}>
                <ExpandBox isFile={true} />
                <ItemIconNewFile highlight={editingNewFileDirectory === parentPath}>
                    <FontAwesome name="plus-square" />
                </ItemIconNewFile>
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
                        <ItemNewText onClick={() => this.onEditNewItem(parentPath)} selected={selectedThis}>
                            <Choose>
                                <When condition={currentlyEditingThis}>{editingNewFileName}</When>
                                <Otherwise>Enter new archive name...</Otherwise>
                            </Choose>
                        </ItemNewText>
                    </Otherwise>
                </Choose>
            </ItemRow>
        );
    }
}

export default RemoteFileTree;
