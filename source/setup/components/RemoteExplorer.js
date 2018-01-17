import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import RemoteFileTree from "./RemoteFileTree.js";

const NOOP = () => {};

const Container = styled.div`
    width: 100%;
`;

class RemoteExplorer extends Component {
    static propTypes = {
        directoriesLoading: PropTypes.arrayOf(PropTypes.string).isRequired,
        fetchType: PropTypes.oneOf(["webdav", "dropbox"]).isRequired,
        onCreateRemotePath: PropTypes.func.isRequired,
        onOpenDirectory: PropTypes.func.isRequired,
        onReady: PropTypes.func.isRequired,
        onSelectRemotePath: PropTypes.func.isRequired,
        rootDirectory: PropTypes.object,
        selectedFilename: PropTypes.string,
        selectedFilenameNeedsCreation: PropTypes.bool.isRequired
    };

    static defaultProps = {
        onCreateRemotePath: NOOP,
        onSelectRemotePath: NOOP,
        selectedFilenameNeedsCreation: false
    };

    componentDidMount() {
        this.props.onReady(this.props.fetchType);
    }

    render() {
        return (
            <Container>
                <RemoteFileTree
                    directoriesLoading={this.props.directoriesLoading}
                    onCreateRemotePath={path => this.props.onCreateRemotePath(path)}
                    onOpenDirectory={dir => this.props.onOpenDirectory(dir, this.props.fetchType)}
                    onSelectRemotePath={path => this.props.onSelectRemotePath(path)}
                    rootDirectory={this.props.rootDirectory}
                    selectedFilename={this.props.selectedFilename}
                    selectedFilenameNeedsCreation={this.props.selectedFilenameNeedsCreation}
                />
            </Container>
        );
    }
}

export default RemoteExplorer;
