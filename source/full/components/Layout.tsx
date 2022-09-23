import React from "react";
import styled from "styled-components";
import { Divider } from "@blueprintjs/core";
import { ChildElements } from "../types.js";

import BUTTERCUP_LOGO from "../../../resources/buttercup-128.png";

interface LayoutProps {
    children: ChildElements;
    title: string;
}

const ContentContainer = styled.div`
    padding: 1rem;
`;
const Header = styled.div`
    margin: 0.5rem 1rem 0;
    padding: 0.3rem 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;
const MainContent = styled.div`
    width: 100vw;
    min-height: 100vh;
    padding: 3rem 0;
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
const Wrapper = styled.div`
    width: 680px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    @media screen and (max-width: 700px) {
        width: 100%;
    }
`;

export function Layout({ children, title }: LayoutProps) {
    return (
        <MainContent>
            <Wrapper>
                <Header>
                    <TitleImage src={BUTTERCUP_LOGO} />
                    <Title>{title}</Title>
                </Header>
                <Divider />
                <ContentContainer>{children}</ContentContainer>
            </Wrapper>
        </MainContent>
    );
}
