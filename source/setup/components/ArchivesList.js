import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const ARCHIVE_IMAGES = {
    dropbox: require("../../../resources/providers/dropbox-256.png"),
    localfile: require("../../../resources/providers/local-256.png"),
    owncloud: require("../../../resources/providers/owncloud-256.png"),
    nextcloud: require("../../../resources/providers/nextcloud-256.png"),
    webdav: require("../../../resources/providers/webdav-256.png")
};

const ArchiveShape = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    state: PropTypes.oneOf(["locked", "unlocked", "pending"]).isRequired
});

const ArchivesContainer = styled.div`
    width: 460px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
`;
const ArchiveRow = styled.div`
    width: calc(100% - 24px);
    height: 60px;
    background-color: ${props => (props.alternate ? "#fff" : "rgb(245,245,245)")};
    padding: 12px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`;
const Avatar = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    border-radius: 20px;
    color: rgba(255, 255, 255, 0.75);
    line-height: 10px;
    font-size: 19px;
    margin-right: 8px;
    background-color: ${props => {
        switch (props.state) {
            case "unlocked":
                return "#5cab7d";
            case "pending":
                return "#dbcd53";
            case "locked":
            /* falls through */
            default:
                return "#f15c5c";
        }
    }};
`;
const ArchiveTitle = styled.span`
    font-size: 15px;
    color: rgb(30, 30, 30);
`;
const ArchiveSubtitle = styled.span`
    font-size: 11px;
    color: rgb(100, 100, 100);
    text-transform: uppercase;
    display: flex;
    direction: row;
    justify-content: flex-start;
    align-items: center;
`;
const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
`;
const ArchiveTypeImage = styled.img`
    height: 13px;
    width: 13px;
    margin-right: 3px;
`;

function getProviderImage(archiveSourceType) {
    const imageSrc = ARCHIVE_IMAGES[archiveSourceType];
    if (!imageSrc) {
        throw new Error(`No image asset for archive type: ${archiveSourceType}`);
    }
    return <ArchiveTypeImage src={imageSrc} />;
}

class ArchivesList extends Component {
    static propTypes = {
        archives: PropTypes.arrayOf(ArchiveShape).isRequired
    };

    render() {
        return (
            <ArchivesContainer>
                <For each="archive" of={this.props.archives}>
                    <ArchiveRow alternate={this.props.archives.indexOf(archive) % 2} key={archive.id}>
                        <Avatar state={archive.state}>{archive.title.substr(0, 2)}</Avatar>
                        <TitleContainer>
                            <ArchiveTitle>{archive.title}</ArchiveTitle>
                            <ArchiveSubtitle>
                                {getProviderImage(archive.type)}
                                {archive.type}
                            </ArchiveSubtitle>
                        </TitleContainer>
                    </ArchiveRow>
                </For>
            </ArchivesContainer>
        );
    }
}

export default ArchivesList;
