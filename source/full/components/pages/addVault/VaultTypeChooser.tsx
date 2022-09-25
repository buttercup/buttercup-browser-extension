import React from "react";
import { Button, ButtonGroup, Card, Classes, H5, Text } from "@blueprintjs/core";
import styled from "styled-components";
import { t } from "../../../../shared/i18n/trans.js";
import { VAULT_TYPES } from "../../../../shared/library/vaultTypes.js";
import { VaultType } from "../../../types.js";

interface VaultTypeChooserProps {
    disabled?: boolean;
    onSelectType: (newType: VaultType) => void;
    selectedType: VaultType | null;
}

const VaultChooser = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
`;
const VaultContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;
const VaultTypeDescription = styled(Card)`
    margin-top: 24px;
`;
const VaultTypeImage = styled.img`
    width: 2rem;
    height: 2rem;
    ${p => (p.darkMode && p.invertOnDarkMode ? "filter: brightness(0) invert(1);" : "")} ${p =>
        p.disabled ? "opacity: 0.4;" : ""};
`;
const VaultText = styled(Text)`
    ${p => (p.disabled ? "opacity: 0.4;" : "")};
`;

export function VaultTypeChooser(props: VaultTypeChooserProps) {
    const { disabled, onSelectType, selectedType } = props;
    const darkMode = false;
    return (
        <VaultChooser>
            <ButtonGroup fill large minimal>
                {Object.keys(VAULT_TYPES).map((vaultType: VaultType) => (
                    <Button
                        key={vaultType}
                        onClick={() => onSelectType(vaultType)}
                        active={selectedType === vaultType}
                        disabled={disabled || VAULT_TYPES[vaultType].disabled}
                        icon={
                            <VaultContainer>
                                <VaultTypeImage
                                    darkMode={darkMode}
                                    invertOnDarkMode={VAULT_TYPES[vaultType].invertOnDarkMode}
                                    src={VAULT_TYPES[vaultType].image}
                                    disabled={disabled || VAULT_TYPES[vaultType].disabled}
                                />{" "}
                                <VaultText
                                    className={Classes.TEXT_MUTED}
                                    disabled={disabled || VAULT_TYPES[vaultType].disabled}
                                >
                                    {t(`vault-type.${vaultType}.title`)}
                                </VaultText>
                            </VaultContainer>
                        }
                    />
                ))}
            </ButtonGroup>
            {selectedType && (
                <VaultTypeDescription>
                    <H5>{t(`vault-type.${selectedType}.title`)}</H5>
                    <p>{t(`vault-type.${selectedType}.description`)}</p>
                </VaultTypeDescription>
            )}
        </VaultChooser>
    );
}
