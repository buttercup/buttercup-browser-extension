import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Button, Colors, Icon, Menu, MenuDivider, MenuItem, Popover, Position } from "@blueprintjs/core";
import styled from "styled-components";
import { ArchiveShape, ArchivesShape } from "../../shared/prop-types/archive.js";
import { VaultIcon } from "./VaultIcon";

const BUTTERCUP_LOGO = require("../../../resources/buttercup-128.png");

const HEADER_SIZE = 30;

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
        onMenuClick: PropTypes.func.isRequired,
        onVaultsClick: PropTypes.func.isRequired,
        onCurrentVaultChange: PropTypes.func.isRequired
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
        const { currentArchive, archives } = this.props;
        const archiveMenu = (
            <Menu>
                <MenuItem
                    icon="shield"
                    text="All Vaults"
                    onClick={() => this.handleVaultChange(null)}
                    active={!currentArchive}
                />
                <MenuDivider />
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
                <MenuItem icon="numbered-list" text="Manage Vaults" onClick={this.props.onVaultsClick} />
            </Menu>
        );
        return (
            <Container>
                <Popover content={archiveMenu} position={Position.BOTTOM_LEFT}>
                    <Button
                        icon={currentArchive ? <VaultIcon vault={currentArchive} /> : "shield"}
                        rightIcon="caret-down"
                        text={currentArchive ? currentArchive.name : "All Vaults"}
                    />
                </Popover>
                <Button onClick={::this.handleMenuClick} icon="cog" minimal />
            </Container>
        );
    }
}

export default HeaderBar;
