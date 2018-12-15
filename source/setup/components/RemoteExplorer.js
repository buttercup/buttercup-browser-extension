import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import RemoteFileTree from "./RemoteFileTree.js";

const NOOP = () => {};

class RemoteExplorer extends Component {
    static propTypes = {
        directoriesLoading: PropTypes.arrayOf(PropTypes.string).isRequired,
        fetchType: PropTypes.oneOf(["webdav", "dropbox", "localfile"]).isRequired,
        onCreateRemotePath: PropTypes.func.isRequired,
        onOpenDirectory: PropTypes.func.isRequired,
        onReady: PropTypes.func.isRequired,
        onSelectRemotePath: PropTypes.func.isRequired,
        rootDirectory: PropTypes.object,
        isLoading: PropTypes.bool.isRequired,
        selectedFilename: PropTypes.string,
        selectedFilenameNeedsCreation: PropTypes.bool.isRequired
    };

    static defaultProps = {
        onCreateRemotePath: NOOP,
        onSelectRemotePath: NOOP,
        selectedFilenameNeedsCreation: false,
        isLoading: true
    };

    componentDidMount() {
        this.props.onReady(this.props.fetchType);
    }

    render() {
        return (
            <RemoteFileTree
                directoriesLoading={this.props.directoriesLoading}
                onCreateRemotePath={path => this.props.onCreateRemotePath(path)}
                onOpenDirectory={dir => this.props.onOpenDirectory(dir, this.props.fetchType)}
                onSelectRemotePath={path => this.props.onSelectRemotePath(path)}
                rootDirectory={this.props.rootDirectory}
                isLoading={this.props.isLoading}
                selectedFilename={this.props.selectedFilename}
                selectedFilenameNeedsCreation={this.props.selectedFilenameNeedsCreation}
            />
        );
    }
}

export default RemoteExplorer;
