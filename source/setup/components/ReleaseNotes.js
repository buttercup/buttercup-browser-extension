import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Dialog from "./Dialog.js";

class ReleaseNotes extends Component {
    static propTypes = {
        onReady: PropTypes.func.isRequired,
        releaseNotes: PropTypes.string
    };

    componentDidMount() {
        this.props.onReady();
    }

    render() {
        return (
            <Dialog title={`⚡️ What's New - v${__VERSION__}`}>
                <If condition={this.props.releaseNotes}>
                    <div dangerouslySetInnerHTML={{ __html: this.props.releaseNotes }} />
                </If>
            </Dialog>
        );
    }
}

export default ReleaseNotes;
