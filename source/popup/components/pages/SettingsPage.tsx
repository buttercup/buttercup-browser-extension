import React, { Fragment, useCallback, useState } from "react";
import styled from "styled-components";
import { Alert, Button, Callout, Classes, Intent, Switch } from "@blueprintjs/core";
import cn from "classnames";
import { t } from "../../../shared/i18n/trans.js";
import { BUILD_DATE, VERSION } from "../../../shared/library/version.js";
import { useConfig } from "../../../shared/hooks/config.js";
import { ErrorMessage } from "../../../shared/components/ErrorMessage.js";
import { resetApplicationSettings } from "../../services/reset.js";
import { getToaster } from "../../../shared/services/notifications.js";
import { localisedErrorMessage } from "../../../shared/library/error.js";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    > .${Classes.CALLOUT}:not(:last-child) {
        margin-bottom: 8px;
    }
`;
const InfoTable = styled.table`
    width: 100%;
`;
const SettingSection = styled(Callout)`
    margin: 0px 12px;
    width: calc(100% - 24px);
    padding: 9px;
`;

export function SettingsPage() {
    const [config, configError, setValue] = useConfig();
    const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);
    const handleReset = useCallback(() => {
        setShowConfirmReset(false);
        resetApplicationSettings().catch(err => {
            console.error(err);
            getToaster().show({
                intent: Intent.DANGER,
                message: t("error.reset", { message: localisedErrorMessage(err) }),
                timeout: 10000
            });
        });
    }, []);
    return (
        <Container>
            {configError && (
                <ErrorMessage message={configError.message} />
            )}
            {config && (
                <Fragment>
                    <SettingSection>
                        <InfoTable className={cn(Classes.HTML_TABLE, Classes.COMPACT)}>
                            <thead>
                                <tr>
                                    <th>{t("config.info.title")}</th>
                                    <th>&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{t("config.info.version")}</td>
                                    <td>{VERSION}</td>
                                </tr>
                                <tr>
                                    <td>{t("config.info.build-date")}</td>
                                    <td>{BUILD_DATE}</td>
                                </tr>
                            </tbody>
                        </InfoTable>
                    </SettingSection>
                    <SettingSection title={t("config.section.theme")}>
                        <Switch
                            checked={config.useSystemTheme}
                            label={t("config.setting.useSystemTheme")}
                            onChange={evt => setValue("useSystemTheme", evt.currentTarget.checked)}
                        />
                        <Switch
                            disabled={config.useSystemTheme}
                            checked={config.theme === "dark"}
                            innerLabel={config.theme === "dark" ? t("theme.dark") : t("theme.light")}
                            label={t("config.setting.theme")}
                            onChange={evt => setValue("theme", evt.currentTarget.checked ? "dark" : "light")}
                        />
                    </SettingSection>
                    <SettingSection title={t("config.section.logins")}>
                        <Switch
                            checked={config.saveNewLogins}
                            label={t("config.setting.saveNewLogins")}
                            onChange={evt => setValue("saveNewLogins", evt.currentTarget.checked)}
                        />
                    </SettingSection>
                    <SettingSection title={t("config.section.privacy")}>
                        <Switch
                            checked={config.entryIcons}
                            label={t("config.setting.entryIcons")}
                            onChange={evt => setValue("entryIcons", evt.currentTarget.checked)}
                        />
                    </SettingSection>
                    <SettingSection title={t("config.section.advanced")}>
                        <Button
                            intent={Intent.DANGER}
                            onClick={() => setShowConfirmReset(true)}
                            text={t("config.setting.reset")}
                        />
                    </SettingSection>
                    <Alert
                        cancelButtonText={t("config.reset-dialog.cancel-button")}
                        confirmButtonText={t("config.reset-dialog.confirm-button")}
                        icon="clean"
                        intent={Intent.DANGER}
                        isOpen={showConfirmReset}
                        onCancel={() => setShowConfirmReset(false)}
                        onConfirm={handleReset}
                    >
                        <p>{t("config.reset-dialog.message")}</p>
                    </Alert>
                </Fragment>
            )}
        </Container>
    );
}

export function SettingsPageControls() {
    return (
        <>
        </>
    );
}
