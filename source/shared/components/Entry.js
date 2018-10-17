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
    Divider,
    Collapse,
    Card,
    FormGroup,
    InputGroup,
    ControlGroup
} from "@blueprintjs/core";
import { getIconForURL } from "../../shared/library/icons.js";
import { EntryShape } from "../prop-types/entry.js";
import { writeToClipboard } from "../library/browser.js";

const NO_ICON = require("../../../resources/no-icon.svg");

const Container = styled.div`
    border-radius: 3px;
    padding: 0.5rem;
    background-color: ${p => (p.isActive ? p.theme.listItemHover : null)};
    &:hover {
        background-color: ${p => p.theme.listItemHover};
    }
`;
const EntryImageBackground = styled.div`
    width: 2.5rem;
    height: 2.5rem;
    background-color: ${p => p.theme.backgroundColor};
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
const EntryRow = styled.div`
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
const Details = styled(Card)`
    margin-top: 0.5rem;
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
        icon: NO_ICON,
        isDetailsVisible: false,
        uncovered: []
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

    toggleSecretCover(property) {
        this.setState(state => ({
            ...state,
            uncovered: state.uncovered.includes(property)
                ? state.uncovered.filter(prop => prop !== property)
                : [...state.uncovered, property]
        }));
    }

    toggleDetails() {
        this.setState(state => ({
            ...state,
            isDetailsVisible: !state.isDetailsVisible
        }));
    }

    renderEntryDetails() {
        const { entry } = this.props;
        const { uncovered } = this.state;
        return (
            <Details>
                <For each="field" of={entry.facade.fields}>
                    <FormGroup key={field.property} label={field.title}>
                        <ControlGroup>
                            <InputGroup
                                className={Classes.FILL}
                                value={field.value ? field.value : ""}
                                readOnly
                                type={field.secret && !uncovered.includes(field.property) ? "password" : "text"}
                            />
                            <If condition={field.secret}>
                                <Button
                                    active={uncovered.includes(field.property)}
                                    icon={uncovered.includes(field.property) ? "eye-open" : "eye-off"}
                                    onClick={() => this.toggleSecretCover(field.property)}
                                />
                            </If>
                            <Button icon="clipboard" onClick={() => this.handleCopyToClipboard(field.property)} />
                        </ControlGroup>
                    </FormGroup>
                </For>
            </Details>
        );
    }

    render() {
        const { entry, onSelectEntry } = this.props;
        const { isDetailsVisible } = this.state;
        const { title, sourceName, entryPath } = entry;
        return (
            <Container isActive={isDetailsVisible}>
                <EntryRow>
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
                        <Button minimal icon="more" active={isDetailsVisible} onClick={() => this.toggleDetails()} />
                    </ButtonGroup>
                </EntryRow>
                <Collapse isOpen={isDetailsVisible}>{this.renderEntryDetails()}</Collapse>
            </Container>
        );
    }
}

export default SearchResult;
