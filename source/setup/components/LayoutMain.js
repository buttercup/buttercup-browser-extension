import React from "react";
import PropTypes from "prop-types";
import { Colors } from "@blueprintjs/core";
import styled from "styled-components";

const BUTTERCUP_LOGO = require("../../../resources/buttercup-128.png");

const MainContent = styled.div`
    width: 100vw;
    min-height: 100vh;
    background-color: #fff;
    padding: 3rem 0;
`;
const Wrapper = styled.div`
    width: 680px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;

    @media screen and (max-width: 700px) {
        width: 100%;
    }
`;
const Header = styled.div`
    margin: 0.5rem 1rem 0;
    padding: 0.3rem 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid ${Colors.LIGHT_GRAY3};
`;
const Title = styled.h1`
    margin: 0px 0px 4px 0px;
    padding: 0;
    font-size: 18px;
    flex: 1;
`;
const TitleImage = styled.img`
    width: 28px;
    height: 28px;
    margin-bottom: 3px;
    margin-right: 6px;
`;
const ContentContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
`;

const LayoutMain = ({ title, children }) => (
    <MainContent>
        <Wrapper>
            <Header>
                <TitleImage src={BUTTERCUP_LOGO} />
                <Title>{title}</Title>
            </Header>
            <ContentContainer>{children}</ContentContainer>
        </Wrapper>
    </MainContent>
);

LayoutMain.propTypes = {
    title: PropTypes.string.isRequired
};

export default LayoutMain;
