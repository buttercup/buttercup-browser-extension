import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import FontAwesome from "react-fontawesome";

const BUTTERCUP_LOGO_SMALL = require("../../../resources/buttercup-128.png");
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
    margin-bottom: 50px;
`;
const ItemRow = styled.div`
    margin-left: ${props => (props.depth ? props.depth * ROW_SIZE_UNIT : 0)}px;
    height: ${ROW_SIZE_UNIT}px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
`;
const ExpandBox = styled.div`
    width: ${ROW_SIZE_UNIT}px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => (props.isFile ? "#ddd" : "rgba(0, 183, 172, 1)")};
    color: #fff;
    margin-right: 4px;
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
const ItemText = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    color: rgb(72, 72, 72);
`;

class RemoteFileTree extends Component {
    static propTypes = {
        onOpenDirectory: PropTypes.func.isRequired,
        rootDirectory: DirectoryShape
    };

    static defaultProps = {
        onOpenDirectory: () => {}
    };

    constructor(props) {
        super(props);
        this.state = {
            openDirectories: ["/"]
        };
    }

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

    render() {
        return (
            <Container>
                <If condition={!!this.props.rootDirectory}>
                    {this.renderDirectory(this.props.rootDirectory)}
                    {this.renderFiles(this.props.rootDirectory, 1)}
                </If>
            </Container>
        );
    }

    renderDirectory(dir, depth = 0) {
        const isOpen = this.state.openDirectories.includes(dir.path);
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
                <ItemText>{dir.name}</ItemText>
            </ItemRow>
        );
        const allItems = [null];
        if (isOpen) {
            allItems.push(...dir.directories);
        }
        return [
            <For each="directory" of={allItems}>
                <Choose>
                    <When condition={directory === null}>{thisItem}</When>
                    <Otherwise>{this.renderDirectory(directory, depth + 1)}</Otherwise>
                </Choose>
            </For>,
            this.renderFiles(dir, depth + 1)
        ];
    }

    renderFiles(dir, depth = 0) {
        return (
            <For each="file" of={dir.files}>
                <ItemRow depth={depth} key={file.path}>
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
                    <ItemText>{file.name}</ItemText>
                </ItemRow>
            </For>
        );
    }
}

export default RemoteFileTree;
