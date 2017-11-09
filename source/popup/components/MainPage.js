import React, { Component } from "react";
import PropTypes from "prop-types";
import HeaderBar from "../containers/HeaderBar.js";
import styled from "styled-components";

const ARCHIVE_IMAGES = {
    dropbox: require("../../../resources/providers/dropbox-256.png"),
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

const ArchiveList = styled.ul`
    list-style-type: none;
    margin: 0;
    padding: 0;
`;
const ArchiveTitle = styled.span`
    font-size: 15px;
    color: rgba(255, 255, 255, 0.75);
`;
const ArchiveSubtitle = styled.span`
    font-size: 11px;
    color: rgba(255, 255, 255, 0.50);
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
const ListContainer = styled.div`
    width: 100%;
    height: 300px;
    overflow-x: hidden;
    overflow-y: scroll;
`;
const ListItem = styled.li`
    background-color: rgba(20, 20, 20, 0.4);
    // padding: 16px 16px 16px 16px;
    padding: 0px 16px;
    height: 60px;
    border-bottom: 1px solid rgba(120, 120, 120, 0.2);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;

    &:hover {
        background-color: rgba(20, 20, 20, 0.05);
    }
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
    }}
`;

function getProviderImage(archiveSourceType) {
    const imageSrc = ARCHIVE_IMAGES[archiveSourceType];
    if (!imageSrc) {
        throw new Error(`No image asset for archive type: ${archiveSourceType}`);
    }
    return (
        <ArchiveTypeImage src={imageSrc} />
    );
}

class MainPage extends Component {
    static propTypes = {
        archives: PropTypes.arrayOf(ArchiveShape).isRequired
    };

    render() {
        return (
            <div>
                <HeaderBar />
                <ListContainer>
                    <ArchiveList>
                        {this.props.archives.map(archive =>
                            <ListItem key={archive.id}>
                                <Avatar state={archive.state}>{archive.title.substr(0, 2)}</Avatar>
                                <TitleContainer>
                                    <ArchiveTitle>{archive.title}</ArchiveTitle>
                                    <ArchiveSubtitle>
                                        {getProviderImage(archive.type)}
                                        {archive.type}
                                    </ArchiveSubtitle>
                                </TitleContainer>
                            </ListItem>
                        )}
                    </ArchiveList>
                </ListContainer>
            </div>
        );
    }
}

export default MainPage;
