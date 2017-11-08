import React, { Component } from "react";
import PropTypes from "prop-types";
import HeaderBar from "../containers/HeaderBar.js";
import styled from "styled-components";

// const ContentContainer = styled.div`
//     width: 100%;
//     position: relative;
//     flex: 1 1 auto;
//     display: flex;
//     flex-direction: column;
// `;

class MainPage extends Component {
    render() {
        return (
            <div>
                <HeaderBar />
            </div>
        );
    }
}

export default MainPage;
