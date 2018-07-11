import React, { Component } from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import styled from "styled-components";
import HeaderBar from "../containers/HeaderBar.js";

const Container = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
`;
const MenuItems = styled.div`
    width: 100%;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    overflow-x: hidden;
    overflow-y: scroll;
`;
const MenuItem = styled.div`
    width: 100%;
    height: 42px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    user-select: none;
    cursor: pointer;

    &:hover {
        background-color: rgba(0, 183, 172, 0.5);
    }
`;
const MenuItemText = styled.span`
    margin-left: 12px;
`;
const MenuItemImage = styled(FontAwesome)`
    width: 14px;
    font-size: 20px;
`;

class MenuPage extends Component {
    static propTypes = {
        onAddArchiveClick: PropTypes.func.isRequired,
        onLockAllClick: PropTypes.func.isRequired,
        onOtherSoftwareClick: PropTypes.func.isRequired
    };

    handleAddVaultClick(event) {
        event.preventDefault();
        this.props.onAddArchiveClick();
    }

    handleLockAllClick(event) {
        event.preventDefault();
        this.props.onLockAllClick();
    }

    handleOtherSoftwareClick(event) {
        event.preventDefault();
        this.props.onOtherSoftwareClick();
    }

    render() {
        return (
            <Container>
                <HeaderBar current="menu" />
                <MenuItems>
                    <MenuItem onClick={::this.handleAddVaultClick}>
                        <MenuItemText>
                            <MenuItemImage name="plus" /> Add Vault
                        </MenuItemText>
                    </MenuItem>
                    <MenuItem onClick={::this.handleLockAllClick}>
                        <MenuItemText>
                            <MenuItemImage name="lock" /> Lock All Vaults
                        </MenuItemText>
                    </MenuItem>
                    <MenuItem onClick={::this.handleOtherSoftwareClick}>
                        <MenuItemText>
                            <MenuItemImage name="mobile" /> Other Applications
                        </MenuItemText>
                    </MenuItem>
                </MenuItems>
            </Container>
        );
    }
}

export default MenuPage;
