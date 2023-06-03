import React from "react";
import styled from "styled-components";
import { useCapturedCredentials } from "../../../hooks/credentials.js";
import { Card, Elevation } from "@blueprintjs/core";

const Credential = styled.h5`
    margin: 0;
    &:not(:last-child) {
        margin-bottom: 4px;
    }
`;
const CredentialsCard = styled(Card)`
    min-width: 280px;
    padding: 10px;
`;
const CredentialsHeading = styled.h4`
    margin: 0 0 5px 0;
`;
const HorizontalScroller = styled.div`
    width: 100%;
    overflow-y: hidden;
    overflow-x: scroll;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    padding: 12px;
`;
const URL = styled.span`
    font-size: 12px;
`;

export function CredentialsSelector() {
    const [credentials, loading, error] = useCapturedCredentials();
    return (
        <HorizontalScroller>
            {credentials.map(cred => (
                <CredentialsCard interactive elevation={Elevation.THREE}>
                    <CredentialsHeading>{cred.title}</CredentialsHeading>
                    <Credential>{cred.username}</Credential>
                    <Credential><code>*********</code></Credential>
                    <URL>{cred.url}</URL>
                </CredentialsCard>
            ))}
        </HorizontalScroller>
    );
}
