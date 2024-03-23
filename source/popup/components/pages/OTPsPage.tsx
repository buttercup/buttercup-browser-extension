import React, { useCallback, useContext, useMemo } from "react";
import styled from "styled-components";
import { Button, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { VaultSourceStatus } from "buttercup";
import { t } from "../../../shared/i18n/trans.js";
import { useDesktopConnectionState, useOTPs, useVaultSources } from "../../hooks/desktop.js";
import { OTPItemList } from "../otps/OTPItemList.js";
import { LaunchContext } from "../contexts/LaunchContext.js";
import { sendOTPToTabForInput } from "../../services/tab.js";
import { usePreparedOTPs } from "../../hooks/otp.js";
import { DesktopConnectionState, OTP } from "../../types.js";
import { getToaster } from "../../../shared/services/notifications.js";
import { createNewTab } from "../../../shared/library/extension.js";
import { formatURL } from "../../../shared/library/url.js";
import { localisedErrorMessage } from "../../../shared/library/error.js";

interface OTPsPageProps {
    onConnectClick: () => Promise<void>;
    onReconnectClick: () => Promise<void>;
}

interface OTPsPageControlsProps {}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
`;
const InvalidState = styled(NonIdealState)`
    margin-top: 28px;
`;

export function OTPsPage(props: OTPsPageProps) {
    const desktopState = useDesktopConnectionState();
    return (
        <Container>
            {desktopState === DesktopConnectionState.NotConnected && (
                <InvalidState
                    title={t("popup.vaults.no-connection.title")}
                    description={t("popup.vaults.no-connection.description")}
                    icon="offline"
                    action={(
                        <Button
                            icon="link"
                            onClick={props.onConnectClick}
                            text={t("popup.vaults.no-connection.action-text")}
                        />
                    )}
                />
            )}
            {desktopState === DesktopConnectionState.Connected && (
                <OTPsPageList {...props} />
            )}
            {desktopState === DesktopConnectionState.Pending && (
                <Spinner size={40} />
            )}
            {desktopState === DesktopConnectionState.Error && (
                <InvalidState
                    title={t("popup.connection.check-error.title")}
                    description={t("popup.connection.check-error.description")}
                    icon="error"
                    intent={Intent.DANGER}
                    action={(
                        <Button
                            icon="link"
                            onClick={props.onReconnectClick}
                            text={t("popup.vaults.no-connection.action-text")}
                        />
                    )}
                />
            )}
        </Container>
    );
}

function OTPsPageList(props: OTPsPageProps) {
    const { formID, source: popupSource } = useContext(LaunchContext);
    const sources = useVaultSources();
    const unlockedCount = useMemo(
        () => sources.reduce(
            (count, source) => source.state === VaultSourceStatus.Unlocked ? count + 1 : count,
            0
        ),
        [sources]
    );
    const [otps, loadingOTPs] = useOTPs();
    const preparedOTPs = usePreparedOTPs(otps);
    const handleOTPClick = useCallback((otp: OTP) => {
        if (popupSource === "page") {
            sendOTPToTabForInput(formID, otp);
        } else if (popupSource === "popup") {
            if (!otp.loginURL) {
                getToaster().show({
                    intent: Intent.PRIMARY,
                    message: t("popup.otps.click.no-url-available"),
                    timeout: 3000
                });
                return;
            }
            createNewTab(formatURL(otp.loginURL))
                .catch(err => {
                    console.error(err);
                    getToaster().show({
                        intent: Intent.DANGER,
                        message: t("popup.otps.click.open-error", { message: localisedErrorMessage(err) }),
                        timeout: 10000
                    });
                });
        }
    }, [popupSource]);
    if (loadingOTPs || (unlockedCount === 0 && otps.length > 0)) {
        return (
            <Spinner size={40} />
        );
    }
    if (unlockedCount === 0) {
        return (
            <InvalidState
                title={t("popup.all-locked.title")}
                description={t("popup.all-locked.description")}
                icon="folder-close"
            />
        );
    } else if (preparedOTPs.length <= 0) {
        return (
            <InvalidState
                title={t("popup.no-otps.title")}
                description={t("popup.no-otps.description")}
                icon="array-numeric"
            />
        );
    }
    return (
        <OTPItemList
            onOTPClick={handleOTPClick}
            otps={preparedOTPs}
        />
    );
}

export function OTPsPageControls(props: OTPsPageControlsProps) {
    return (
        <>
        </>
    );
}
