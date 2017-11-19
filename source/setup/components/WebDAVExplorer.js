import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import RemoteFileTree from "./RemoteFileTree.js";

class WebDAVExplorer extends Component {
    static propTypes = {};

    render() {
        return (
            <div>
                <RemoteFileTree />
            </div>
        );
    }
}

export default WebDAVExplorer;
