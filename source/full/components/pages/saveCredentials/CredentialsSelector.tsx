import React, { useCallback } from "react";
import styled from "styled-components";
import { useCapturedCredentials } from "../../../hooks/credentials.js";
import { Card, Elevation } from "@blueprintjs/core";
import { UsedCredentials } from "../../../types.js";

interface CredentialsSelectorProps {
    onSelect: (itemID: string) => void;
    selected: string | null;
}

const Credential = styled.h5`
    margin: 0;

    &:not(:last-child) {
        margin-bottom: 4px;
    }
`;
const CredentialsCard = styled(Card)`
    min-width: 280px;
    padding: 10px;

    &:not(:last-child) {
        margin-right: 8px;
    }
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

export function CredentialsSelector(props: CredentialsSelectorProps) {
    const { onSelect, selected } = props;
    const [credentials, loading, error] = useCapturedCredentials();
    const handleItemClick = useCallback((credential: UsedCredentials) => {
        onSelect(credential.id);
    }, [onSelect]);
    return (
        <HorizontalScroller>
            {credentials.map(cred => (
                <CredentialsCard
                    interactive={selected !== cred.id}
                    elevation={selected === cred.id ? Elevation.ZERO : Elevation.THREE}
                    onClick={() => handleItemClick(cred)}
                >
                    <CredentialsHeading>{cred.title}</CredentialsHeading>
                    <Credential>{cred.username}</Credential>
                    <Credential><code>*********</code></Credential>
                    <URL>{cred.url}</URL>
                </CredentialsCard>
            ))}
        </HorizontalScroller>
    );
}
