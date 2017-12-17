import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import FontAwesome from "react-fontawesome";
import { getIconForURL } from "../library/icons.js";

const KEY_ICON = require("../../../resources/key.png");

const ROW_HEIGHT = 64;

const Container = styled.div`
    width: 100%;
    height: ${ROW_HEIGHT}px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-shrink: 0;
`;
const EntryImage = styled.div`
    width: 52px;
    height: 52px;
    margin: 0px 8px;
    background: url(${props => props.data});
    background-size: 52px 52px;
    background-repeat: no-repeat;
    flex-shrink: 0;
`;
const DetailsContainer = styled.div`
    flex-grow: 2;
    flex-shrink: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    overflow: auto;
`;
const DetailRow = styled.div`
    width: calc(100% - 16px);
    padding-left: 8px;
    padding-right: 8px;
    overflow: hidden;
    height: 22px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`;
const Title = styled.span`
    font-size: 16px;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
const Subtitle = styled.span`
    color: rgb(180, 180, 180);
    text-overflow: ellipsis;
    white-space: nowrap;
`;
const EnterDetailsAndLoginButton = styled.div`
    width: ${ROW_HEIGHT}px;
    height: ${ROW_HEIGHT}px;
    color: rgba(240, 240, 240, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28px;
    cursor: pointer;
    flex-shrink: 0;

    &:hover {
        background-color: rgba(0, 183, 172, 0.5);
    }
`;

class SearchResult extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        sourceID: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        url: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            icon: KEY_ICON
        };
    }

    componentWillMount() {
        if (this.props.url) {
            getIconForURL(this.props.url).then(icon => {
                if (icon) {
                    this.setState({
                        icon
                    });
                }
            });
        }
    }

    render() {
        return (
            <Container>
                <EntryImage data={this.state.icon} />
                <DetailsContainer>
                    <DetailRow>
                        <Title>{this.props.title}</Title>
                    </DetailRow>
                    <DetailRow>
                        <Subtitle>
                            <FontAwesome name="cube" /> Some details
                        </Subtitle>
                    </DetailRow>
                </DetailsContainer>
                <EnterDetailsAndLoginButton>
                    <FontAwesome name="sign-in" />
                </EnterDetailsAndLoginButton>
            </Container>
        );
    }
}

export default SearchResult;
