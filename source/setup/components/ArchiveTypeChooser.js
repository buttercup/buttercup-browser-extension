import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const ARCHIVE_TYPES = [
    {
        type: "dropbox",
        title: "Dropbox",
        image: require("../../../resources/providers/dropbox-256.png")
    },
    {
        type: "owncloud",
        title: "ownCloud",
        image: require("../../../resources/providers/owncloud-256.png")
    },
    {
        type: "nextcloud",
        title: "Nextcloud",
        image: require("../../../resources/providers/nextcloud-256.png")
    },
    {
        type: "webdav",
        title: "WebDAV",
        image: require("../../../resources/providers/webdav-256.png")
    }
];

const Container = styled.div`
    border: 1px solid #eee;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
`;
const ArchiveItemContainer = styled.div`
    width: 80px;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    background-color: ${props => props.selected ? "rgba(0, 183, 172, 0.2)" : "none"};

    &:hover {
        background-color: rgba(0, 183, 172, 0.3);
    }
`;
const ArchiveTypeImage = styled.img`
    margin-top: 16px;
    width: 26px;
    height: 26px;
`;
const ArchiveTypeTitle = styled.div`
    margin-top: 4px;
`;

class ArchiveTypeChooser extends Component {
    static propTypes = {
        selectedArchiveType: PropTypes.string,
        onSelectArchiveType: PropTypes.func.isRequired
    };

    render() {
        return (
            <Container>
                <For each="provider" of={ARCHIVE_TYPES}>
                    <ArchiveItemContainer
                        key={provider.type}
                        onClick={() => this.props.onSelectArchiveType(provider.type)}
                        selected={this.props.selectedArchiveType === provider.type}
                    >
                        <ArchiveTypeImage src={provider.image} />
                        <ArchiveTypeTitle>{provider.title}</ArchiveTypeTitle>
                    </ArchiveItemContainer>
                </For>
            </Container>  
        );
    }
}

export default ArchiveTypeChooser;
