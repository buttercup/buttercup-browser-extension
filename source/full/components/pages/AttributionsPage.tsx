import React from "react";
import styled from "styled-components";
import { Layout } from "../Layout.js";
import { t } from "../../../shared/i18n/trans.js";
import { useTitle } from "../../hooks/document.js";
import COMPUTER_ICON from "../../../../resources/providers/local-256.png";

const AttributionLI = styled.li`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const ImageIcon = styled.img`
    width: auto;
    height: 32px;
    margin-right: 12px;
`;

export function AttributionsPage() {
    useTitle(t("attributions-page.title"));
    return (
        <Layout title={t("attributions-page.title")}>
            <p>Buttercup is Open Source Software and makes use of many free and openly available libraries and resources.</p>
            <p>Below are a list of resource attributions that this browser extension makes use of.</p>
            <ul>
                <AttributionLI>
                    <ImageIcon src={COMPUTER_ICON} />
                    <a target="_blank" href="https://www.flaticon.com/free-icons/computer" title="computer icons">Computer icons created by Freepik - Flaticon</a>
                </AttributionLI>
            </ul>
        </Layout>
    );
}
