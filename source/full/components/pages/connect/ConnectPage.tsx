import React, { useCallback, useState } from "react";
import { Intent } from "@blueprintjs/core";
import { Layout } from "../../Layout.js";
import { t } from "../../../../shared/i18n/trans.js";
import { CodeInput } from "./CodeInput.js";
import { sendBackgroundMessage } from "../../../services/messaging.js";
import { getToaster } from "../../../../shared/services/notifications.js";
import { closeCurrentTab } from "../../../../shared/library/extension.js";
import { localisedErrorMessage } from "../../../../shared/library/error.js";
import { BackgroundMessageType } from "../../../types.js";

export function ConnectPage() {
    const [code, setCode] = useState<string>("");
    const [authenticating, setAuthenticating] = useState<boolean>(false);
    const handleSubmitCode = useCallback(async () => {
        if (!code) return;
        setAuthenticating(true);
        sendBackgroundMessage({ type: BackgroundMessageType.AuthenticateDesktopConnection, code })
            .then(() => {
                getToaster().show({
                    intent: Intent.SUCCESS,
                    message: t("full.connect.auth-success"),
                    timeout: 3000
                });
                setTimeout(() => {
                    closeCurrentTab();
                }, 3000);
            })
            .catch(err => {
                console.error(err);
                getToaster().show({
                    intent: Intent.DANGER,
                    message: t("full.connect.auth-error", { message: localisedErrorMessage(err) }),
                    timeout: 10000
                });
                setAuthenticating(false);
            });
    }, [code]);
    return (
        <Layout title={t("full.connect.title")}>
            <p>{t("full.connect.description")}</p>
            <p>{t("full.connect.instruction")}</p>
            <CodeInput
                authenticating={authenticating}
                onChange={setCode}
                onSubmit={handleSubmitCode}
                value={code}
            />
        </Layout>
    );
}
