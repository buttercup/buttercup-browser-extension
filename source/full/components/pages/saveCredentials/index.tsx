import React, { Fragment, useCallback, useState } from "react";
import { Intent, Tab, Tabs } from "@blueprintjs/core";
import { Layout } from "../../Layout.js";
import { t } from "../../../../shared/i18n/trans.js";
import { useTitle } from "../../../hooks/document.js";
import { CredentialsSelector } from "./CredentialsSelector.js";
import { CredentialsSaver } from "./CredentialsSaver.js";
import { saveCredentialsToEntry } from "../../../services/credentials.js";
import { getToaster } from "../../../../shared/services/notifications.js";
import { localisedErrorMessage } from "../../../../shared/library/error.js";
import { closeCurrentTab } from "../../../../shared/library/extension.js";
import { SavedCredentials } from "../../../types.js";

enum TabID {
    SaveNew = "save-new",
    UpdateExisting = "update-existing"
}

export function SaveCredentialsPage() {
    useTitle(t("save-credentials-page.title"));
    const [selectedTabID, setSelectedTabID] = useState<TabID>(TabID.SaveNew);
    const [selectedID, setSelectedID] = useState<string | null>(null);
    const [saving, setSaving] = useState<boolean>(false);
    const handleSaveNew = useCallback((credentials: SavedCredentials) => {
        setSaving(true);
        saveCredentialsToEntry(credentials)
            .then(entryID => {
                getToaster().show({
                    intent: Intent.SUCCESS,
                    message: t("save-credentials-page.save-success", { title: credentials.title }),
                    timeout: 4000
                });
                setTimeout(() => {
                    closeCurrentTab();
                }, 4000);
            })
            .catch(err => {
                console.error(err);
                getToaster().show({
                    intent: Intent.DANGER,
                    message: t("save-credentials-page.save-error", { message: localisedErrorMessage(err) }),
                    timeout: 10000
                });
            })
    }, []);
    return (
        <Layout title={t("save-credentials-page.title")}>
            <p>{t("save-credentials-page.description")}</p>
            <h3>{t("save-credentials-page.detected-logins.heading")}</h3>
            <CredentialsSelector
                disabled={saving}
                onSelect={setSelectedID}
                selected={selectedID}
            />
            {selectedID && (
                <Fragment>
                    <h3>{t("save-credentials-page.credentials-saver.heading")}</h3>
                    <Tabs
                        onChange={newID => setSelectedTabID(newID as TabID)}
                        renderActiveTabPanelOnly
                        selectedTabId={selectedTabID}
                    >
                        <Tab
                            disabled={saving}
                            id={TabID.SaveNew}
                            title={t("save-credentials-page.credentials-saver.create-new.tab")}
                            panel={
                                <CredentialsSaver
                                    mode="new"
                                    onSaveNewClick={handleSaveNew}
                                    saving={saving}
                                    selected={selectedID}
                                />
                            }
                        />
                        <Tab
                            disabled={saving}
                            id={TabID.UpdateExisting}
                            title={t("save-credentials-page.credentials-saver.update-existing.tab")}
                            panel={
                                <CredentialsSaver
                                    mode="existing"
                                    onSaveNewClick={handleSaveNew}
                                    saving={saving}
                                    selected={selectedID}
                                />
                            }
                        />
                    </Tabs>
                </Fragment>
            )}
        </Layout>
    );
}
