import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import cx from "classnames";
import {
    Colors,
    Text,
    Classes,
    ButtonGroup,
    Button,
    Tooltip,
    Position,
    Divider,
    Menu,
    MenuItem,
    Popover,
    MenuDivider
} from "@blueprintjs/core";
import { getIconForURL } from "../../shared/library/icons.js";
import { EntryShape } from "../prop-types/entry.js";
import { writeToClipboard } from "../library/browser.js";

const NO_ICON = require("../../../resources/no-icon.svg");

const Container = styled.div`
    border-radius: 3px;
    padding: 0.5rem;
    &:hover {
        background-color: ${p => p.theme.listItemHover};
    }
`;
const EntryImageBackground = styled.div`
    width: 2.5rem;
    height: 2.5rem;
    background-color: ${p => p.theme.backgroundFrameColor};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    padding: 3px;
    border: 1px solid ${p => p.theme.listItemHover};
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
        autoLoginEnabled: PropTypes.bool,
        entry: EntryShape
    };

    static defaultProps = {
        autoLoginEnabled: true
    };

    state = {
        icon: NO_ICON
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

    handleCopyToClipboard(property, facade = true) {
        const { entry } = this.props;
        if (facade) {
            const field = entry.facade.fields.find(item => item.property === property && item.field === "property");
            if (field) {
                writeToClipboard(field.value);
            }
        } else {
            writeToClipboard(entry[property]);
        }
    }

    renderDropdown() {
        return (
            <Menu>
                <MenuItem icon="user" text="Copy Username" onClick={() => this.handleCopyToClipboard("username")} />
                <MenuItem icon="key" text="Copy Password" onClick={() => this.handleCopyToClipboard("password")} />
                <If condition={this.props.entry.url}>
                    <MenuDivider />
                    <MenuItem icon="globe" text="Copy URL" onClick={() => this.handleCopyToClipboard("url", false)} />
                </If>
            </Menu>
        );
    }

    render() {
        const { entry, onSelectEntry } = this.props;
        const { title, sourceName, entryPath } = entry;
        return (
            <Container>
                <DetailsContainer>
                    <EntryImageBackground>
                        <EntryImage src={this.state.icon} />
                    </EntryImageBackground>
                    <DetailRow onClick={() => onSelectEntry(entry.sourceID, entry.id)}>
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
                        <If condition={this.props.autoLoginEnabled}>
                            <Tooltip content="Auto Sign In">
                                <Button
                                    minimal
                                    icon="log-in"
                                    onClick={() => onSelectEntry(entry.sourceID, entry.id, /* auto sign in: */ true)}
                                />
                            </Tooltip>
                        </If>
                        <Popover content={this.renderDropdown()} position={Position.TOP_RIGHT}>
                            <Button minimal icon="duplicate" rightIcon="caret-down" />
                        </Popover>
                    </ButtonGroup>
                </DetailsContainer>
            </Container>
        );
    }
}

export default SearchResult;
