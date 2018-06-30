import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import FontAwesome from "react-fontawesome";

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
`;
const Logo = styled.img`
    width: ${HEADER_SIZE - 6}px;
    height: auto;
    margin: 3px;
`;
// const Logo = styled.div`
//     padding-left: 8px;
//     display: flex;
//     flex-direction: column;
//     justify-content: space-around;

//     h1 {
//         color: rgb(0, 183, 172);
//         text-shadow: 2px 2px 2px rgba(0, 183, 172, 0.25);
//     }
// `;
// const MenuButton = styled.div`
//     width: ${HEADER_SIZE}px;
//     height: ${HEADER_SIZE}px;
//     background-color: rgb(0, 183, 172);
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     cursor: pointer;

//     > .fa {
//         font-size: 26px;
//         color: #000;
//     }
// `;

// export const MenuStateShape = PropTypes.oneOf(["archives", "options"]);

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
                {/*<If condition={this.props.menuState === "archives"}>
                    <Logo>
                        <h1>Buttercup</h1>
                    </Logo>
                </If>
                <MenuButton onClick={() => this.props.onMenuClick()} key="menu">
                    <FontAwesome name="bars" />
                </MenuButton>*/}
            </Container>
        );
    }
}

export default HeaderBar;
