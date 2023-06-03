import React from "react";
import styled from "styled-components";
import { Layout } from "../../Layout.js";
import { t } from "../../../../shared/i18n/trans.js";
import { useTitle } from "../../../hooks/document.js";
import { CredentialsSelector } from "./CredentialsSelector.js";



export function SaveCredentialsPage() {
    useTitle(t("save-credentials-page.title"));
    return (
        <Layout title={t("save-credentials-page.title")}>
            <p>{t("save-credentials-page.description")}</p>
            <h3>{t("save-credentials-page.detected-logins.heading")}</h3>
            <CredentialsSelector />
        </Layout>
    );
}
