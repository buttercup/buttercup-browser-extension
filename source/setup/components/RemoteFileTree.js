import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import FontAwesome from "react-fontawesome";

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
        rootDirectory: DirectoryShape
    };

    // removeThis:
    // static defaultProps = {
    //     root: {
    //         path: "/",
    //         name: "/",
    //         directories: [
    //             {
    //                 path: "/Documents",
    //                 name: "Documents",
    //                 directories: [],
    //                 files: []
    //             },
    //             {
    //                 path: "/Photos",
    //                 name: "Photos",
    //                 directories: [],
    //                 files: []
    //             },
    //             {
    //                 path: "/Public",
    //                 name: "Public",
    //                 directories: [],
    //                 files: []
    //             }
    //         ],
    //         files: [
    //             {
    //                 path: "/some-file.txt",
    //                 name: "some-file.txt"
    //             },
    //             {
    //                 path: "/photo.jpg",
    //                 name: "photo.jpg"
    //             }
    //         ]
    //     }
    // };

    constructor(props) {
        super(props);
        this.state = {
            openDirectories: ["/"]
        };
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
                <ExpandBox>
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
        return (
            <For each="directory" of={allItems}>
                <Choose>
                    <When condition={directory === null}>{thisItem}</When>
                    <Otherwise>{this.renderDirectory(directory, depth + 1)}</Otherwise>
                </Choose>
            </For>
        );
    }

    renderFiles(dir, depth = 0) {
        return (
            <For each="file" of={dir.files}>
                <ItemRow depth={depth} key={file.path}>
                    <ExpandBox isFile={true} />
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
