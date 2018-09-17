import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Button, Colors, Icon, Menu, MenuDivider, MenuItem, Popover, Position } from "@blueprintjs/core";
import styled from "styled-components";
import { VaultIcon } from "./VaultIcon";
import { ArchiveShape, ArchivesShape } from "../../shared/prop-types/archive.js";
import { version } from "../../../package.json";

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid ${Colors.LIGHT_GRAY2};
    padding: 0.5rem;
`;

class HeaderBar extends PureComponent {
    static propTypes = {
        currentArchive: ArchiveShape,
        archives: ArchivesShape,
        current: PropTypes.string,
        onItemsClick: PropTypes.func.isRequired,
        onVaultsClick: PropTypes.func.isRequired,
        onCurrentVaultChange: PropTypes.func.isRequired,
        onAddArchiveClick: PropTypes.func.isRequired,
        onLockAllClick: PropTypes.func.isRequired,
        onOtherSoftwareClick: PropTypes.func.isRequired
    };

    handleItemsClick(event) {
        event.preventDefault();
        this.props.onItemsClick();
    }

    handleMenuClick(event) {
        event.preventDefault();
        this.props.onMenuClick();
    }

    handleVaultChange(vault) {
        this.props.onCurrentVaultChange(vault ? vault.id : null);
    }

    render() {
        const { currentArchive, archives, location } = this.props;
        const archiveMenu = (
            <Menu>
                <If condition={archives.length > 0}>
                    <MenuDivider title="Current Vault:" />
                    <MenuItem
                        icon="shield"
                        text="All Vaults"
                        onClick={() => this.handleVaultChange(null)}
                        active={!currentArchive}
                    />
                    <For each="vault" of={archives} index="index">
                        <MenuItem
                            active={currentArchive && currentArchive.id === vault.id}
                            icon={<VaultIcon vault={vault} />}
                            label={vault.status === "locked" ? <Icon icon="lock" /> : null}
                            text={vault.name}
                            key={index}
                            onClick={() => this.handleVaultChange(vault)}
                        />
                    </For>
                    <MenuDivider />
                </If>
                <MenuItem text="Add Vault" icon="add" onClick={::this.props.onAddArchiveClick} />
                <MenuItem text="Lock All Vaults" icon="lock" onClick={::this.props.onLockAllClick} />
                <MenuItem icon="numbered-list" text="Manage Vaults" onClick={this.props.onVaultsClick} />
            </Menu>
        );
        const optionsMenu = (
            <Menu>
                <MenuItem text="Other Applications" icon="mobile-phone" onClick={::this.props.onOtherSoftwareClick} />
                <MenuDivider />
                <MenuItem text={`Buttercup v${version}`} icon="info-sign" disabled />
            </Menu>
        );
        return (
            <Container>
                <Choose>
                    <When condition={location.pathname !== "/"}>
                        <Button text="Back" icon="arrow-left" onClick={::this.props.onItemsClick} />
                    </When>
                    <When condition={location.pathname === "/" && archives.length === 0}>
                        <Button icon="add" onClick={::this.props.onAddArchiveClick} />
                    </When>
                    <Otherwise>
                        <Popover content={archiveMenu} position={Position.BOTTOM_LEFT}>
                            <Button
                                icon={currentArchive ? <VaultIcon vault={currentArchive} /> : "shield"}
                                rightIcon="caret-down"
                                text={currentArchive ? currentArchive.name : "All Vaults"}
                            />
                        </Popover>
                    </Otherwise>
                </Choose>
                <Popover content={optionsMenu} position={Position.BOTTOM_RIGHT}>
                    <Button icon="cog" minimal />
                </Popover>
            </Container>
        );
    }
}

export default HeaderBar;
