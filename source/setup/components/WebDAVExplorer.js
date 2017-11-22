import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import RemoteFileTree from "./RemoteFileTree.js";

const NOOP = () => {};

class WebDAVExplorer extends Component {
    static propTypes = {
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
        this.props.onReady();
    }

    render() {
        return (
            <div>
                <RemoteFileTree
                    onCreateRemotePath={path => this.props.onCreateRemotePath(path)}
                    onOpenDirectory={dir => this.props.onOpenDirectory(dir)}
                    onSelectRemotePath={path => this.props.onSelectRemotePath(path)}
                    rootDirectory={this.props.rootDirectory}
                    selectedFilename={this.props.selectedFilename}
                    selectedFilenameNeedsCreation={this.props.selectedFilenameNeedsCreation}
                />
            </div>
        );
    }
}

export default WebDAVExplorer;
