import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import cx from "classnames";
import {
    Colors,
    Divider,
    Text,
    Classes,
    NonIdealState,
    Button,
    Intent,
    Icon,
    Spinner,
    Callout,
    Popover,
    Menu,
    MenuItem,
    Position
} from "@blueprintjs/core";
import { ArchivesShape } from "../../shared/prop-types/archive.js";
import { VAULT_TYPES } from "../../shared/library/icons.js";
import { VaultIcon } from "./VaultIcon.js";
import { lockAllArchives } from "../library/messaging.js";

const Container = styled.div`
    overflow-x: hidden;
    overflow-y: scroll;
    flex: 1;
`;
const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-left: 0.5rem;
`;
const ListItem = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: 3px;
    padding: 0.5rem;

    &:hover {
        background-color: ${p => p.theme.listItemHover};
    }
`;
const CalloutBar = styled(Callout)`
    margin-bottom: 0.5rem;
`;
const IconWrapper = styled.div`
    margin-right: 0.5rem;
`;

class ArchivesListPage extends PureComponent {
    static propTypes = {
        archives: ArchivesShape,
        darkMode: PropTypes.bool,
        onArchiveClick: PropTypes.func.isRequired,
        onAddArchiveClick: PropTypes.func.isRequired,
        onLockArchive: PropTypes.func.isRequired,
        onRemoveArchive: PropTypes.func.isRequired
    };

    state = {
        lockingAll: false,
        lockedSuccessfully: false
    };

    handleLockArchives() {
        this.setState(state => ({
            ...state,
            lockingAll: true
        }));
        lockAllArchives()
            .then(() => {
                this.setState(state => ({
                    ...state,
                    lockedSuccessfully: true
                }));
                setTimeout(() => this.props.history.goBack(), 2500);
            })
            .catch(err => {
                console.error(err);
            });
    }

    handleLockArchive(vault) {
        this.props.onLockArchive(vault.id);
    }

    handleRemoveArchive(vault) {
        this.props.onRemoveArchive(vault.id);
    }

    componentDidMount() {
        if (this.props.location.state && this.props.location.state.lockAll === true) {
            this.handleLockArchives();
        }
    }

    render() {
        return (
            <Container>
                <If condition={this.state.lockedSuccessfully}>
                    <CalloutBar intent={Intent.SUCCESS}>All vaults have been locked.</CalloutBar>
                </If>
                <Choose>
                    <When condition={this.props.archives.length > 0}>{this.renderArchivesList()}</When>
                    <Otherwise>
                        <NonIdealState
                            title="No Vaults"
                            description="Hmm.. There aren't any vaults yet."
                            icon="offline"
                            action={
                                <Button
                                    text="Add Vault"
                                    icon="add"
                                    intent={Intent.SUCCESS}
                                    onClick={::this.props.onAddArchiveClick}
                                />
                            }
                        />
                    </Otherwise>
                </Choose>
            </Container>
        );
    }

    renderContextMenu(vault) {
        return (
            <Menu>
                <Choose>
                    <When condition={vault.status === "unlocked"}>
                        <MenuItem text="Lock" icon="lock" onClick={() => this.handleLockArchive(vault)} />
                    </When>
                    <Otherwise>
                        <MenuItem
                            text="Unlock"
                            icon="unlock"
                            onClick={() => this.props.onArchiveClick(vault.id, vault.state)}
                        />
                    </Otherwise>
                </Choose>
                <MenuItem text="Remove" icon="trash" onClick={() => this.handleRemoveArchive(vault)} />
            </Menu>
        );
    }

    renderArchivesList() {
        return (
            <For each="vault" of={this.props.archives}>
                <With vaultTypeInfo={VAULT_TYPES.find(item => item.type === vault.type)}>
                    <ListItem key={vault.id}>
                        <Choose>
                            <When condition={this.state.lockingAll}>
                                <Spinner size={40} />
                            </When>
                            <Otherwise>
                                <VaultIcon vault={vault} isLarge />
                            </Otherwise>
                        </Choose>
                        <TitleContainer onClick={e => this.props.onArchiveClick(vault.id, vault.state)}>
                            <Text>
                                {vault.name}
                                <If condition={vault.status === "locked"}>
                                    {" "}
                                    <Icon icon="lock" color={Colors.GRAY3} iconSize={12} />
                                </If>
                            </Text>
                            <Text className={cx(Classes.TEXT_SMALL, Classes.TEXT_MUTED)}>{vaultTypeInfo.title}</Text>
                        </TitleContainer>
                        <Popover content={this.renderContextMenu(vault)} minimal position={Position.BOTTOM_RIGHT}>
                            <Button icon="chevron-down" minimal />
                        </Popover>
                    </ListItem>
                    <Divider />
                </With>
            </For>
        );
    }
}

export default ArchivesListPage;
