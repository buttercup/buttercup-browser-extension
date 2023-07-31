import React, { Fragment, useCallback, useMemo } from "react";
import styled from "styled-components";
import { Card, Elevation } from "@blueprintjs/core";
import { SiteIcon } from "@buttercup/ui";
import { EntryType } from "buttercup";
import { useCapturedCredentials } from "../../../hooks/credentials.js";
import { extractDomain } from "../../../../shared/library/domain.js";
import { ErrorMessage } from "../../../../shared/components/ErrorMessage.js";
import { UsedCredentials } from "../../../types.js";

interface CredentialsSelectorProps {
    disabled?: boolean;
    onSelect: (id: string) => void;
    selected: string | null;
}

const Credential = styled.h5`
    margin: 0;
    ${p => p.monospace ? "font-family: monospace;" : ""}

    &:not(:last-child) {
        margin-bottom: 4px;
    }
`;
const CredentialsCard = styled(Card)`
    min-width: 280px;
    padding: 10px;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    &:not(:last-child) {
        margin-right: 8px;
    }
`;
const CredentialsHeading = styled.h4`
    margin: 0 0 5px 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
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
const CredentialsIcon = styled(SiteIcon)`
    width: 24px;
    height: 24px;
    margin-right: 6px;

    > img {
        width: 100%;
        height: 100%;
    }
`;
const URL = styled.span`
    font-size: 12px;
`;

export function CredentialsSelector(props: CredentialsSelectorProps) {
    const { disabled: parentDisabled = false, onSelect, selected } = props;
    const [credentials, loading, error] = useCapturedCredentials();
    const disabled = parentDisabled || loading;
    const handleItemClick = useCallback((credential: UsedCredentials) => {
        if (disabled) return;
        onSelect(credential.id);
    }, [disabled, onSelect]);
    const credentialDomains = useMemo(
        () => credentials.map(cred => extractDomain(cred.url)),
        [credentials]
    );
    return (
        <Fragment>
            {error && (
                <ErrorMessage message={error.message} scroll={false} />
            )}
            <HorizontalScroller>
                {credentials.map((cred, ind) => (
                    <CredentialsCard
                        disabled={disabled}
                        key={cred.id}
                        interactive={cred.id !== selected}
                        elevation={cred.id === selected ? Elevation.ZERO : Elevation.THREE}
                        onClick={() => handleItemClick(cred)}
                    >
                        <CredentialsHeading>
                            <CredentialsIcon
                                domain={credentialDomains[ind]}
                                type={EntryType.Website}
                            />
                            <span>{cred.title}</span>
                        </CredentialsHeading>
                        <Credential monospace>{cred.username}</Credential>
                        <Credential monospace><code>*********</code></Credential>
                        <URL>{cred.url}</URL>
                    </CredentialsCard>
                ))}
            </HorizontalScroller>
        </Fragment>
    );
}
