import React, { Fragment } from "react";
import styled from "styled-components";
import { Callout, Classes, Switch } from "@blueprintjs/core";
import cn from "classnames";
import { t } from "../../../shared/i18n/trans.js";
import { BUILD_DATE, VERSION } from "../../../shared/library/version.js";
import { useConfig } from "../../hooks/config.js";
import { ErrorMessage } from "../ErrorMessage.js";

interface SettingsPageProps {}

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

export function SettingsPage(props: SettingsPageProps) {
    const [config, configError, setValue] = useConfig();
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
                                    <th>Info</th>
                                    <th>&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Buttercup</td>
                                    <td>{VERSION}</td>
                                </tr>
                                <tr>
                                    <td>Built</td>
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
                    <SettingSection title={t("config.setting.logins")}>
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
