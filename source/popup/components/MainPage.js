import React, { Component } from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import HeaderBar from "../containers/HeaderBar.js";
import styled from "styled-components";
import { MenuStateShape } from "./HeaderBar.js";

const ARCHIVE_IMAGES = {
    dropbox: require("../../../resources/providers/dropbox-256.png"),
    owncloud: require("../../../resources/providers/owncloud-256.png"),
    nextcloud: require("../../../resources/providers/nextcloud-256.png"),
    webdav: require("../../../resources/providers/webdav-white-256.png")
};
const MENU_ARROW = require("../../../resources/arrow-up.png");

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
    color: rgba(255, 255, 255, 0.5);
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
    }};
`;
const OptionsList = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
`;
const OptionsItem = styled.div`
    width: 44%;
    height: 100px;
    border: 1px solid rgba(200, 200, 200, 0.2);
    margin: 6px 0px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    color: rgb(150, 150, 150);

    > .fa {
        margin-top: 20px;
        font-size: 34px;
    }

    > div {
        margin-top: 6px;
        font-size: 18px;
    }

    &:hover {
        border: 1px solid rgba(0, 183, 172, 0.5);
        color: rgba(0, 183, 172, 1);
    }
`;
const NoArchivesContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const NoArchivesInner = styled.div`
    width: 95%;
    height: 95%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @keyframes topMove {
        from {
            top: 0px;
        }

        to {
            top: 10px;
        }
    }
`;
const MenuArrowContainer = styled.div`
    width: 40px;
    height: 40px;
    background: url(${MENU_ARROW});
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    opacity: 0.7;
    position: absolute;
    top: 0px;
    right: 0px;
    animation-duration: 1s;
    animation-name: topMove;
    animation-iteration-count: infinite;
    animation-direction: alternate;
`;
const MessageHeader = styled.div`
    font-size: 18px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 16px;
`;
const Message = styled.div`
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    width: 80%;
    text-align: center;
`;

function getProviderImage(archiveSourceType) {
    const imageSrc = ARCHIVE_IMAGES[archiveSourceType];
    if (!imageSrc) {
        throw new Error(`No image asset for archive type: ${archiveSourceType}`);
    }
    return <ArchiveTypeImage src={imageSrc} />;
}

class MainPage extends Component {
    static propTypes = {
        archives: PropTypes.arrayOf(ArchiveShape).isRequired,
        menuState: MenuStateShape.isRequired,
        onAddArchiveClick: PropTypes.func.isRequired,
        onArchiveClick: PropTypes.func.isRequired,
        onLockAllClick: PropTypes.func.isRequired,
        onMenuClick: PropTypes.func.isRequired,
        onOtherSoftwareClick: PropTypes.func.isRequired
    };

    render() {
        return (
            <div>
                <HeaderBar menuState={this.props.menuState} onMenuClick={() => this.props.onMenuClick()} />
                <ListContainer>
                    <Choose>
                        <When condition={this.props.menuState === "options"}>
                            <OptionsList>
                                <OptionsItem onClick={() => this.props.onAddArchiveClick()}>
                                    <FontAwesome name="plus" />
                                    <div>Add Archive</div>
                                </OptionsItem>
                                <OptionsItem onClick={() => this.props.onLockAllClick()}>
                                    <FontAwesome name="lock" />
                                    <div>Lock All</div>
                                </OptionsItem>
                                <OptionsItem>
                                    <FontAwesome name="cog" />
                                    <div>Settings</div>
                                </OptionsItem>
                                <OptionsItem onClick={() => this.props.onOtherSoftwareClick()}>
                                    <FontAwesome name="cloud-download" />
                                    <div>Other Apps</div>
                                </OptionsItem>
                            </OptionsList>
                        </When>
                        <Otherwise>
                            <Choose>
                                <When condition={this.props.archives.length > 0}>{this.renderArchivesList()}</When>
                                <Otherwise>{this.renderNoArchives()}</Otherwise>
                            </Choose>
                        </Otherwise>
                    </Choose>
                </ListContainer>
            </div>
        );
    }

    renderArchivesList() {
        return (
            <ArchiveList>
                {this.props.archives.map(archive => (
                    <ListItem key={archive.id} onClick={() => this.props.onArchiveClick(archive.id, archive.state)}>
                        <Avatar state={archive.state}>{archive.title.substr(0, 2)}</Avatar>
                        <TitleContainer>
                            <ArchiveTitle>{archive.title}</ArchiveTitle>
                            <ArchiveSubtitle>
                                {getProviderImage(archive.type)}
                                {archive.type}
                            </ArchiveSubtitle>
                        </TitleContainer>
                    </ListItem>
                ))}
            </ArchiveList>
        );
    }

    renderNoArchives() {
        return (
            <NoArchivesContainer>
                <NoArchivesInner>
                    <MenuArrowContainer />
                    <MessageHeader>No Archives</MessageHeader>
                    <Message>Hmm.. There aren't any archives yet. Why not add one by using the menu?</Message>
                </NoArchivesInner>
            </NoArchivesContainer>
        );
    }
}

export default MainPage;
