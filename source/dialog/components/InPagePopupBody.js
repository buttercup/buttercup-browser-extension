import React from "react";
import styled from "styled-components";
import { Card as CardBase, H4 } from "@blueprintjs/core";

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    padding: 2rem;
`;
const Card = styled(CardBase)`
    flex: 1;
    flex-direction: column;
    display: flex;
`;
const CardBody = styled.div`
    flex: 1;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
const CardFooter = styled.div`
    display: grid;
    grid-template-columns: 1fr 32px 1fr;
    grid-gap: 1rem;
`;

export default function InPagePopupBody(props = {}) {
    const { children = null, footer = null, title } = props;
    return (
        <Container>
            <Card interactive>
                <CardBody>
                    <H4>{title}</H4>
                    {children}
                </CardBody>
                <If condition={footer}>
                    <CardFooter>{footer}</CardFooter>
                </If>
            </Card>
        </Container>
    );
}
