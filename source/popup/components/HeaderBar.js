import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button as Button2, Menu, MenuDivider, MenuItem, Popover, Position, Icon } from "@blueprintjs/core";
import FontAwesome from "react-fontawesome";
import styled from "styled-components";
import { ArchiveShape, ArchivesShape } from "../../shared/prop-types/archive.js";
import { VaultIcon } from "./VaultIcon";

const BUTTERCUP_LOGO = require("../../../resources/buttercup-128.png");

const HEADER_SIZE = 30;

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    position: relative;
    padding: 0.5rem;
`;
const Logo = styled.img`
    height: 16px;
    width: auto;
    flex: 0;
`;
const Buttons = styled.div`
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    cursor: pointer;
    user-select: none;
`;
const Separator = styled.div`
    width: 1px;
    height: 100%;
    background-color: rgba(220, 220, 220, 0.4);
`;
const Button = styled.div`
    height: 100%;
    padding: 0px 14px;
    color: ${props => (props.selected ? "#eee" : "#aaa")};
    font-size: 14px;
    display: flex;
    flex-direction: row;
    align-items: center;

    &:hover {
        background-color: rgba(0, 183, 172, 0.5);
    }
`;
const Version = styled.span`
    position: absolute;
    font-size: 10px;
    font-style: italic;
    color: #666;
    top: 8px;
    left: ${HEADER_SIZE + 5}px;
`;

class HeaderBar extends Component {
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
                {/* <Logo src={BUTTERCUP_LOGO} /> */}
                <Popover content={archiveMenu} position={Position.BOTTOM_LEFT}>
                    <Button2
                        icon={currentArchive ? <VaultIcon vault={currentArchive} /> : "shield"}
                        rightIcon="caret-down"
                        text={currentArchive ? currentArchive.name : "All Vaults"}
                    />
                </Popover>
                {/* <Version>v{version}</Version> */}
                <Buttons>
                    <Separator />
                    <Separator />
                    <Button onClick={::this.handleMenuClick} selected={this.props.current === "menu"}>
                        <FontAwesome name="bars" />
                    </Button>
                </Buttons>
            </Container>
        );
    }
}

export default HeaderBar;
