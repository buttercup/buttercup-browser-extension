import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import RemoteFileTree from "./RemoteFileTree.js";

class WebDAVExplorer extends Component {
    static propTypes = {
        onOpenDirectory: PropTypes.func.isRequired,
        onReady: PropTypes.func.isRequired,
        rootDirectory: PropTypes.object
    };

    componentDidMount() {
        this.props.onReady();
    }

    render() {
        return (
            <div>
                <RemoteFileTree
                    onOpenDirectory={dir => this.props.onOpenDirectory(dir)}
                    rootDirectory={this.props.rootDirectory}
                />
            </div>
        );
    }
}

export default WebDAVExplorer;
