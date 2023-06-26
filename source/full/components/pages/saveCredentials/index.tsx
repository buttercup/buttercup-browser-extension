import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { Layout } from "../../Layout.js";
import { t } from "../../../../shared/i18n/trans.js";
import { useTitle } from "../../../hooks/document.js";
import { CredentialsSelector } from "./CredentialsSelector.js";
import { CredentialsSaver } from "./CredentialsSaver.js";

export function SaveCredentialsPage() {
    useTitle(t("save-credentials-page.title"));
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
                    <CredentialsSaver selected={selectedID} />
                </Fragment>
            )}
        </Layout>
    );
}
