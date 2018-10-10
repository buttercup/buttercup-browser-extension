import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import cx from "classnames";
import { Colors, Text, Classes, ButtonGroup, Button, Tooltip, Position, Collapse, Divider } from "@blueprintjs/core";
import { getIconForURL } from "../../shared/library/icons.js";
import { EntryShape } from "../prop-types/entry.js";

const NO_ICON = require("../../../resources/no-icon.svg");

const Container = styled.div`
    border-radius: 3px;
    padding: 0.5rem;
    background-color: ${p => (p.isDetailsOpen ? Colors.LIGHT_GRAY3 : "transparent")};
    &:hover {
        background-color: ${Colors.LIGHT_GRAY3};
    }
`;
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
    cursor: pointer;
    align-items: center;
`;
const DetailRow = styled.div`
    margin-left: 0.5rem;
    flex: 1;
`;
const Title = styled(Text)`
    margin-bottom: 0.3rem;
`;

class SearchResult extends PureComponent {
    static propTypes = {
        onSelectEntry: PropTypes.func.isRequired,
        entry: EntryShape
    };

    state = {
        icon: NO_ICON,
        isDetailsOpen: false
    };

    componentWillMount() {
        this.mounted = true;
        const url = this.props.entry.url;
        if (url) {
            getIconForURL(url)
                .then(icon => {
                    if (icon && this.mounted) {
                        this.setState({
                            icon
                        });
                    }
                })
                .catch(() => {
                    // Ignore errors
                });
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    handleToggleDetails(event) {
        event.preventDefault();
        event.stopPropagation();
        this.setState(state => ({
            ...state,
            isDetailsOpen: !state.isDetailsOpen
        }));
    }

    render() {
        const { entry, onSelectEntry } = this.props;
        const { title, sourceName, entryPath } = entry;
        const { isDetailsOpen } = this.state;
        return (
            <Container isDetailsOpen={isDetailsOpen}>
                <DetailsContainer onClick={() => onSelectEntry(entry.sourceID, entry.id)}>
                    <EntryImageBackground>
                        <EntryImage src={this.state.icon} />
                    </EntryImageBackground>
                    <DetailRow>
                        <Title>{title}</Title>
                        <Text className={cx(Classes.TEXT_SMALL, Classes.TEXT_MUTED)}>
                            {sourceName} ›{" "}
                            <For each="group" index="index" of={entryPath}>
                                <If condition={index > 0}> › </If>
                                {group}
                            </For>
                        </Text>
                    </DetailRow>
                    <ButtonGroup>
                        <Tooltip content="Auto Sign In">
                            <Button
                                minimal
                                icon="log-in"
                                onClick={() => onSelectEntry(entry.sourceID, entry.id, /* auto sign in: */ true)}
                            />
                        </Tooltip>
                        <Button minimal active={isDetailsOpen} icon="more" onClick={::this.handleToggleDetails} />
                    </ButtonGroup>
                </DetailsContainer>
                <Collapse isOpen={isDetailsOpen}>
                    <Divider />
                    <div>Details here</div>
                </Collapse>
            </Container>
        );
    }
}

export default SearchResult;
