import React from "react";
import { H4 } from "@blueprintjs/core";
import { Layout } from "../../Layout.js";
import { t } from "../../../../shared/i18n/trans.js";
import { useTitle } from "../../../hooks/document.js";

export function AddVaultPage() {
    useTitle(t("add-vault-page.title"));
    return (
        <Layout title={t("add-vault-page.title")}>
            <H4>{t("add-vault-page.section-type.heading")}</H4>
            
        </Layout>
    );
}
