import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { Layout } from "../../Layout.js";
import { t } from "../../../../shared/i18n/trans.js";
import { useTitle } from "../../../hooks/document.js";
import { CredentialsSelector } from "./CredentialsSelector.js";
import { CredentialsSaver } from "./CredentialsSaver.js";
import { Tab, Tabs } from "@blueprintjs/core";

enum TabID {
    SaveNew = "save-new",
    UpdateExisting = "update-existing"
}

export function SaveCredentialsPage() {
    useTitle(t("save-credentials-page.title"));
    const [selectedTabID, setSelectedTabID] = useState<TabID>(TabID.SaveNew);
    const [selectedID, setSelectedID] = useState<string | null>(null);
    return (
        <Layout title={t("save-credentials-page.title")}>
            <p>{t("save-credentials-page.description")}</p>
            <h3>{t("save-credentials-page.detected-logins.heading")}</h3>
            <CredentialsSelector
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
                            id={TabID.SaveNew}
                            title={t("save-credentials-page.credentials-saver.create-new.tab")}
                            panel={<CredentialsSaver selected={selectedID} />}
                        />
                        <Tab
                            id={TabID.UpdateExisting}
                            title={t("save-credentials-page.credentials-saver.update-existing.tab")}
                            panel={<div>Test</div>}
                            disabled
                        />
                    </Tabs>
                </Fragment>
            )}
        </Layout>
    );
}
