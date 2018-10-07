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
    Callout
} from "@blueprintjs/core";
import HeaderBar from "../containers/HeaderBar.js";
import { ArchiveShape, ArchivesShape } from "../../shared/prop-types/archive.js";
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
        background-color: ${Colors.LIGHT_GRAY3};
    }
`;
const CalloutBar = styled(Callout)`
    margin-bottom: 0.5rem;
`;

class ArchivesListPage extends PureComponent {
    static propTypes = {
        archives: ArchivesShape,
        onArchiveClick: PropTypes.func.isRequired,
        onAddArchiveClick: PropTypes.func.isRequired
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

    renderArchivesList() {
        return (
            <For each="vault" of={this.props.archives}>
                <ListItem key={vault.id} onClick={() => this.props.onArchiveClick(vault.id, vault.state)}>
                    <VaultIcon vault={vault} isLarge />
                    <TitleContainer>
                        <Text>{vault.title}</Text>
                        <Text className={cx(Classes.TEXT_SMALL, Classes.TEXT_MUTED)}>{vault.type}</Text>
                    </TitleContainer>
                    <Choose>
                        <When condition={vault.status === "locked"}>
                            <Icon icon="lock" color={Colors.GRAY3} />
                        </When>
                        <When condition={this.state.lockingAll}>
                            <Spinner size={16} />
                        </When>
                    </Choose>
                </ListItem>
                <Divider />
            </For>
        );
    }
}

export default ArchivesListPage;
