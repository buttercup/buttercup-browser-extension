import React from "react";
import styled from "styled-components";
import { VAULT_TYPES } from "../../shared/library/icons.js";

const Wrapper = styled.div`
    width: ${p => (p.isLarge ? "40px" : "20px")};
    height: ${p => (p.isLarge ? "40px" : "20px")};
    border-radius: 50%;
    background-color: ${p => p.vault.colour};
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        width: ${p => (p.isLarge ? "28px" : "14px")};
        height: auto;
        ${p => (p.darkMode && p.invertOnDarkMode ? "filter: brightness(0) invert(1);" : "")};
    }
`;

export const VaultIcon = ({ vault, darkMode = false, isLarge = false }) => (
    <With vaultImg={VAULT_TYPES.find(item => item.type === vault.type)}>
        <Wrapper vault={vault} isLarge={isLarge} darkMode={darkMode} invertOnDarkMode={vaultImg.invertOnDarkMode}>
            <img src={vaultImg.image} />
        </Wrapper>
    </With>
);
