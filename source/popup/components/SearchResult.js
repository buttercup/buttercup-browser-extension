import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import FontAwesome from "react-fontawesome";
import cx from "classnames";
import { Colors, Text, Classes } from "@blueprintjs/core";
import { getIconForURL } from "../../shared/library/icons.js";

const KEY_ICON = require("../../../resources/no-icon.svg");

const EntryImageBackground = styled.div`
    width: 2.5rem;
    height: 2.5rem;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    padding: 3px;
    border: 1px solid ${Colors.LIGHT_GRAY3};
`;
const EntryImage = styled.img`
    display: block;
    width: 100%;
    height: auto;
    border-radius: 2px;
`;
const DetailsContainer = styled.div`
    flex: 1;
    width: 100%;
    display: flex;
    overflow: auto;
    cursor: pointer;
    border-radius: 3px;
    padding: 0.5rem;

    &:hover {
        background-color: ${Colors.LIGHT_GRAY3};
    }
`;
const DetailRow = styled.div`
    margin-left: 1rem;
    flex: 1;
`;
const Title = styled(Text)`
    margin-bottom: 0.3rem;
`;

class SearchResult extends Component {
    static propTypes = {
        entryID: PropTypes.string.isRequired,
        onSelectEntry: PropTypes.func.isRequired,
        sourceID: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        url: PropTypes.string
    };

    state = {
        icon: KEY_ICON
    };

    componentWillMount() {
        this.mounted = true;
        if (this.props.url) {
            getIconForURL(this.props.url).then(icon => {
                if (icon && this.mounted) {
                    this.setState({
                        icon
                    });
                }
            });
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    handleClickEntry(event) {
        event.preventDefault();
        this.props.onSelectEntry(this.props.sourceID, this.props.entryID);
    }

    render() {
        const [sourceName, ...groups] = this.props.path;
        return (
            <DetailsContainer onClick={::this.handleClickEntry}>
                <EntryImageBackground>
                    <EntryImage src={this.state.icon} />
                </EntryImageBackground>
                <DetailRow>
                    <Title>{this.props.title}</Title>
                    <Text className={cx(Classes.TEXT_SMALL, Classes.TEXT_MUTED)}>
                        {sourceName} ›{" "}
                        <For each="group" index="index" of={groups}>
                            <If condition={index > 0}> › </If>
                            {group}
                        </For>
                    </Text>
                </DetailRow>
            </DetailsContainer>
        );
    }
}

export default SearchResult;
