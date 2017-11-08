import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import FontAwesome from "react-fontawesome";

const HEADER_SIZE = 50;

const Container = styled.div`
    width: 100%;
    height: ${HEADER_SIZE}px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid rgba(80, 80, 80, 1);

    background-color: rgba(10, 10, 10, 1.0);

    // background: #141E30;  /* fallback for old browsers */
    // background: -webkit-linear-gradient(to bottom, #243B55, #141E30);  /* Chrome 10-25, Safari 5.1-6 */
    // background: linear-gradient(to bottom, #243B55, #141E30); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`;
const Logo = styled.div`
    padding-left: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    
    h1 {
        color: rgb(0, 183, 172);
        text-shadow: 2px 2px 2px rgba(0, 183, 172, 0.25);
    }
`;
const MenuButton = styled.div`
    width: ${HEADER_SIZE}px;
    height: ${HEADER_SIZE}px;
    background-color: rgb(0, 183, 172);
    display: flex;
    justify-content: center;
    align-items: center;

    > .fa {
        font-size: 26px;
        color: #000;
    }
`;

class HeaderBar extends Component {
    render() {
        return (
            <Container>
                <Logo>
                    <h1>Buttercup</h1>
                </Logo>
                <MenuButton>
                    <FontAwesome name="bars" />
                </MenuButton>
            </Container>
        );
    }
}

export default HeaderBar;
