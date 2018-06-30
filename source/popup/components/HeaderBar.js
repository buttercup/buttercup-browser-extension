import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import FontAwesome from "react-fontawesome";
import { version } from "../../../package.json";

const BUTTERCUP_LOGO = require("../../../resources/buttercup-128.png");

const HEADER_SIZE = 30;

const Container = styled.div`
    width: 100%;
    height: ${HEADER_SIZE}px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid rgba(80, 80, 80, 1);
    background-color: rgba(10, 10, 10, 1);
    position: relative;
`;
const Logo = styled.img`
    width: ${HEADER_SIZE - 6}px;
    height: auto;
    margin: 3px;
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
        // menuState: MenuStateShape.isRequired,
        // onMenuClick: PropTypes.func.isRequired
    };

    static defaultProps = {
        // onMenuClick: () => {}
    };

    render() {
        return (
            <Container>
                <Logo src={BUTTERCUP_LOGO} />
                <Version>v{version}</Version>
                <Buttons>
                    <Separator />
                    <Button>Vaults</Button>
                    <Separator />
                    <Button>Items</Button>
                    <Separator />
                    <Button>
                        <FontAwesome name="bars" />
                    </Button>
                </Buttons>
            </Container>
        );
    }
}

export default HeaderBar;
