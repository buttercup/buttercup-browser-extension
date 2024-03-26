import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { EntryType } from "buttercup";
import { SiteIcon } from "@buttercup/ui";
import { Button, Card, H5, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { LaunchContext } from "../contexts/LaunchContext.js";
import { t } from "../../../shared/i18n/trans.js";
import { useLoginCredentials } from "../../hooks/credentials.js";
import { getToaster } from "../../../shared/services/notifications.js";
import { clearSavedLoginPrompt } from "../../queries/loginMemory.js";
import { localisedErrorMessage } from "../../../shared/library/error.js";
import { extractDomain } from "../../../shared/library/domain.js";
import { BackgroundMessageType } from "../../types.js";
import { disableDomainForLogin } from "../../queries/disabledDomains.js";
import { sendBackgroundMessage } from "../../../shared/services/messaging.js";

const Buttons = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    flex: 0 0 auto;

    > button:not(:last-child) {
        margin-right: 6px;
    }
`;
const Container = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 10px;
    display: flex;
    flex-direction: column;
`;
const CredentialsCard = styled(Card)`
    min-width: 280px;
    padding: 10px;
    margin-right: 0px !important;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    &:not(:last-child) {
        margin-right: 8px;
    }
`;
const CredentialsHeading = styled.h5`
    margin: 0 0 5px 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
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
const Heading = styled(H5)`
    flex: 0 0 auto;
`;
const Scroller = styled.div`
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    margin-bottom: 8px;
    flex: 1 1 auto;
`;
const SpinnerContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 1 auto;

`;
const URL = styled.span`
    font-size: 12px;
`;

export function SaveDialogPage() {
    const { loginID } = useContext(LaunchContext);
    const credentials = useLoginCredentials(loginID);
    const errorShownRef = useRef<boolean>(false);
    const [disableConfirm, setDisableConfirm] = useState<boolean>(false);
    const handleViewClick = useCallback(async () => {
        try {
            // Open save page and close dialog
            await sendBackgroundMessage({
                type: BackgroundMessageType.OpenSaveCredentialsPage
            });
        } catch (err) {
            console.error(err);
            getToaster().show({
                intent: Intent.DANGER,
                message: t("error.generic", { message: localisedErrorMessage(err) }),
                timeout: 10000
            });
        }
    }, [loginID]);
    const handleCloseClick = useCallback(async () => {
        try {
            // Clear prompt and close dialog
            await clearSavedLoginPrompt(loginID);
        } catch (err) {
            console.error(err);
            getToaster().show({
                intent: Intent.DANGER,
                message: t("error.generic", { message: localisedErrorMessage(err) }),
                timeout: 10000
            });
        }
    }, [loginID]);
    const handleDisableClick = useCallback(async () => {
        if (!disableConfirm) {
            setDisableConfirm(true);
            return;
        }
        try {
            // Disable domain and close dialog
            await disableDomainForLogin(loginID);
        } catch (err) {
            console.error(err);
            getToaster().show({
                intent: Intent.DANGER,
                message: t("error.generic", { message: localisedErrorMessage(err) }),
                timeout: 10000
            });
        }
    }, [disableConfirm, loginID]);
    useEffect(() => {
        if (credentials.error && !errorShownRef.current) {
            errorShownRef.current = true;
            console.error(credentials.error);
            getToaster().show({
                intent: Intent.DANGER,
                message: t("save-credentials-dialog.credentials-fetch-error", { message: localisedErrorMessage(credentials.error) }),
                timeout: 10000
            });
        }
    }, [credentials]);
    return (
        <Container>
            <Heading>{t("save-credentials-dialog.title")}</Heading>
            {credentials.loading && (
                <SpinnerContainer>
                    <Spinner size={50} />
                </SpinnerContainer>
            )}
            {credentials.error && (
                <Scroller>
                    <NonIdealState
                        icon="high-priority"
                        title={t("save-credentials-dialog.error-title")}
                        description={t("save-credentials-dialog.error-description")}
                    />
                </Scroller>
            )}
            {credentials.value && (
                (
                    <Scroller>
                        <p>{t("save-credentials-dialog.description")}</p>
                        <p><strong>{t("save-credentials-dialog.last-login-heading")}:</strong></p>
                        <CredentialsCard>
                            <CredentialsHeading>
                                <CredentialsIcon
                                    domain={extractDomain(credentials.value.url)}
                                    type={EntryType.Website}
                                />
                                <span>{credentials.value.title}</span>
                            </CredentialsHeading>
                            <URL>{credentials.value.url}</URL>
                        </CredentialsCard>
                    </Scroller>
                )
            )}
            <Buttons>
                <Button
                    disabled={!credentials.value}
                    icon="saved"
                    intent={Intent.PRIMARY}
                    onClick={handleViewClick}
                    text={t("save-credentials-dialog.view-button")}
                />
                <Button
                    disabled={!credentials.value}
                    icon="disable"
                    intent={disableConfirm ? Intent.DANGER : Intent.WARNING}
                    onClick={handleDisableClick}
                    text={disableConfirm ? t("save-credentials-dialog.disable-confirm-button") : t("save-credentials-dialog.disable-button")}
                />
                <Button
                    onClick={handleCloseClick}
                    text={t("save-credentials-dialog.close-button")}
                />
            </Buttons>
        </Container>
    )
}
