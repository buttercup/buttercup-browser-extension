import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import cx from "classnames";
import {
    Text,
    Classes,
    ButtonGroup,
    Button,
    Tooltip,
    FormGroup,
    InputGroup,
    ControlGroup,
    Dialog
} from "@blueprintjs/core";
import { SiteIcon } from "@buttercup/ui";
import { EntryShape } from "../prop-types/entry.js";
import { writeToClipboard } from "../library/browser.js";
import { EntryPropertyValueType, EntryURLType, fieldsToProperties, getEntryURLs } from "../library/buttercup.js";
import { extractDomain } from "../library/domain.js";

const Container = styled.div`
    border-radius: 3px;
    padding: 0.5rem;
    background-color: ${p => (p.isActive ? p.theme.listItemHover : null)};
    position: relative;
    z-index: ${p => (p.isActive ? 100 : 0)};

    &:hover {
        background-color: ${p => p.theme.listItemHover};
    }
`;
const EntryImageBackground = styled.div`
    width: 2.5rem;
    height: 2.5rem;
    flex: 0 0 auto;
    background-color: ${p => p.theme.backgroundColor};
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    border-radius: 3px;
    border: 1px solid ${p => p.theme.listItemHover};
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
    overflow: hidden;
    flex: 1;
`;
const Title = styled(Text)`
    margin-bottom: 0.3rem;
`;
const Details = styled.div`
    overflow: auto;
    margin: 0 !important;
    padding: 20px !important;
`;
const EntryIcon = styled(SiteIcon)`
    width: calc(100% - 6px);
    height: calc(100% - 6px);
    margin: 3px;
    overflow: hidden;

    > img {
        width: 100%;
        height: 100%;
    }
`;

class SearchResult extends PureComponent {
    static propTypes = {
        autoLoginEnabled: PropTypes.bool,
        entry: EntryShape,
        icons: PropTypes.bool,
        onSelectEntry: PropTypes.func.isRequired
    };

    static defaultProps = {
        autoLoginEnabled: true,
        icons: false
    };

    state = {
        isDetailsVisible: false,
        uncovered: []
    };

    handleCopyToClipboard(property, facade = true) {
        const { entry } = this.props;
        if (facade) {
            const field = entry.facade.fields.find(
                item => item.property === property && item.propertyType === "property"
            );
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
        const fields = entry.facade.fields.filter(
            field => field.removeable === false && field.property !== "title" && field.propertyType === "property"
        );
        return (
            <Details className={Classes.DIALOG_BODY}>
                <For each="field" of={fields}>
                    <With isSecret={field.valueType === EntryPropertyValueType.Password}>
                        <FormGroup key={field.property} label={field.title}>
                            <ControlGroup>
                                <InputGroup
                                    className={Classes.FILL}
                                    value={field.value ? field.value : ""}
                                    readOnly
                                    type={isSecret && !uncovered.includes(field.property) ? "password" : "text"}
                                />
                                <If condition={isSecret}>
                                    <Button
                                        active={uncovered.includes(field.property)}
                                        icon={uncovered.includes(field.property) ? "eye-open" : "eye-off"}
                                        onClick={() => this.toggleSecretCover(field.property)}
                                    />
                                </If>
                                <Button icon="clipboard" onClick={() => this.handleCopyToClipboard(field.property)} />
                            </ControlGroup>
                        </FormGroup>
                    </With>
                </For>
            </Details>
        );
    }

    render() {
        const { entry, onSelectEntry } = this.props;
        const { isDetailsVisible } = this.state;
        const { title, sourceName, entryPath } = entry;
        let iconDomain = null;
        if (this.props.icons === true) {
            const entryProps = fieldsToProperties(entry.facade.fields);
            const [url] = [
                ...getEntryURLs(entryProps, EntryURLType.Icon),
                ...getEntryURLs(entryProps, EntryURLType.Any)
            ];
            if (url) {
                iconDomain = extractDomain(url);
            }
        }
        const path = (
            <Fragment>
                {sourceName} ›{" "}
                <For each="group" index="index" of={entryPath}>
                    <If condition={index > 0}> › </If>
                    {group}
                </For>
            </Fragment>
        );
        return (
            <Fragment>
                <Container isActive={isDetailsVisible}>
                    <EntryRow>
                        <EntryImageBackground>
                            <EntryIcon domain={iconDomain} />
                        </EntryImageBackground>
                        <DetailRow onClick={() => onSelectEntry(entry.sourceID, entry.id)}>
                            <Title title={title}>
                                <Text ellipsize>{title}</Text>
                            </Title>
                            <Text ellipsize className={cx(Classes.TEXT_SMALL, Classes.TEXT_MUTED)}>
                                {path}
                            </Text>
                        </DetailRow>
                        <ButtonGroup>
                            <If condition={this.props.autoLoginEnabled}>
                                <Tooltip content="Auto Sign In">
                                    <Button
                                        minimal
                                        icon="log-in"
                                        onClick={() =>
                                            onSelectEntry(entry.sourceID, entry.id, /* auto sign in: */ true)
                                        }
                                    />
                                </Tooltip>
                            </If>
                            <Button
                                minimal
                                icon="more"
                                active={isDetailsVisible}
                                onClick={() => this.toggleDetails()}
                            />
                        </ButtonGroup>
                        <Dialog
                            title={title}
                            isOpen={isDetailsVisible}
                            onClose={() => this.toggleDetails()}
                            style={{
                                margin: "1rem",
                                height: "calc(100vh - 2rem)",
                                width: "calc(100vw - 2rem)",
                                paddingBottom: "10px"
                            }}
                        >
                            {this.renderEntryDetails()}
                            <div className={Classes.DIALOG_FOOTER}>
                                <Text className={cx(Classes.TEXT_MUTED, Classes.TEXT_SMALL)}>{path}</Text>
                            </div>
                        </Dialog>
                    </EntryRow>
                </Container>
            </Fragment>
        );
    }
}

export default SearchResult;
