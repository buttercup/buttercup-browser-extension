import React, { useState } from "react";
import { H4 } from "@blueprintjs/core";
import styled from "styled-components";
import { Layout } from "../../Layout.js";
import { t } from "../../../../shared/i18n/trans.js";
import { useTitle } from "../../../hooks/document.js";
import { VaultTypeChooser } from "./VaultTypeChooser.js";
import { VaultType } from "../../../types.js";

const Heading = styled(H4)`
    margin-bottom: 24px;
`;

export function AddVaultPage() {
    useTitle(t("add-vault-page.title"));
    const [vaultType, setVaultType] = useState<VaultType>(null);
    return (
        <Layout title={t("add-vault-page.title")}>
            <Heading>{t("add-vault-page.section-type.heading")}</Heading>
            <VaultTypeChooser
                onSelectType={setVaultType}
                selectedType={vaultType}
            />
        </Layout>
    );
}
