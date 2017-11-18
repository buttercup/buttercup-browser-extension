import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const BUTTERCUP_LOGO = require("../../../resources/buttercup-128.png");

const MainContent = styled.div`
    width: 600px;
    min-height: 100vh;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;
const Header = styled.div`
    width: calc(100% - 20px);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 5px 10px 8px 10px;
    padding-top: 10px;
    border-bottom: 1px solid #eee;
`;
const Title = styled.h1`
    margin: 0px 0px 4px 0px;
    padding: 0;
    font-size: 18px;
`;
const TitleImage = styled.img`
    width: 28px;
    height: 28px;
    margin-bottom: 3px;
    margin-right: 6px;
`;
const ContentContainer = styled.div`
    width: 90%;
    /* text-align: left; */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
`;

class LayoutMain extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired
    };

    render() {
        return (
            <MainContent>
                <Header>
                    <TitleImage src={BUTTERCUP_LOGO} />
                    <Title>{this.props.title}</Title>
                </Header>
                <ContentContainer>
                    {this.props.children}
                </ContentContainer>
            </MainContent>
        );
    }
}

export default LayoutMain;
