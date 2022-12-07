import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Colors, H5, HTMLTable, Icon, InputGroup, Intent } from "@blueprintjs/core";
import styled from "styled-components";
import { t } from "../../../../shared/i18n/trans.js";
import { VaultType } from "../../../types.js";

interface VaultConfirmationProps {
    onConfirm: (name: string, masterPassword: string) => void;
    vaultFilename: string;
    vaultIsNew: boolean;
    vaultType: VaultType;
}

const DetailsTable = styled(HTMLTable)`
    width: 100%;
`;
const ErrorMessage = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    color: ${Colors.RED2};
    margin-top: 4px;
`;
const Heading = styled(H5)`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const HeadingIcon = styled(Icon)`
    margin-right: 8px;
`;
const RightAlign = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-start;
`;

export function VaultConfirmation(props: VaultConfirmationProps) {
    const [password, setPassword] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");
    const [continueDisabled, setContinueDisabled] = useState<boolean>(true);
    const [passwordError, setPasswordError] = useState<string>(null);
    const [passwordError2, setPasswordError2] = useState<string>(null);
    const [hasEditedPassword, setHasEditedPassword] = useState<boolean>(false);
    const [hasEditedPassword2, setHasEditedPassword2] = useState<boolean>(false);
    const vaultSourceName = useMemo(() => {
        const name = t(`vault-type.${props.vaultType}.title`);
        return name || props.vaultType;
    }, [props.vaultType]);
    useEffect(() => {
        setPasswordError(null);
        setPasswordError2(null);
        if (hasEditedPassword && password.length === 0) {
            setPasswordError(t("add-vault-page.section-confirm.error.password-empty"));
        }
        if (props.vaultIsNew) {
            if (hasEditedPassword2 && password2.length === 0) {
                setPasswordError2(t("add-vault-page.section-confirm.error.password-empty"));
            } else if (hasEditedPassword2 && password !== password2) {
                setPasswordError2(t("add-vault-page.section-confirm.error.password-mismatch"));
            }
        }
        if (password.length > 0) {
            setHasEditedPassword(true);
        }
        if (password2.length > 0) {
            setHasEditedPassword2(true);
        }
        if (props.vaultIsNew && password.length > 0 && password === password2) {
            setContinueDisabled(false);
        } else if (!props.vaultIsNew && password.length > 0) {
            setContinueDisabled(false);
        }
    }, [password, password2, props.vaultIsNew, hasEditedPassword, hasEditedPassword2]);
    return (
        <>
            <Card>
                <Heading>
                    <HeadingIcon icon="info-sign" />
                    {t("add-vault-page.section-confirm.details-heading")}
                </Heading>
                <DetailsTable>
                    <tbody>
                        <tr>
                            <th>{t("add-vault-page.section-confirm.vault-source")}</th>
                            <td>{vaultSourceName}</td>
                        </tr>
                        <tr>
                            <th>{t("add-vault-page.section-confirm.vault-file")}</th>
                            <td><code>{props.vaultFilename}</code></td>
                        </tr>
                        <tr>
                            <th>{t("add-vault-page.section-confirm.vault-create-new")}</th>
                            <td>{props.vaultIsNew ? "Yes" : "No"}</td>
                        </tr>
                        <tr>
                            <th>{t("add-vault-page.section-confirm.vault-password")}</th>
                            <td>
                                <InputGroup
                                    onChange={evt => setPassword(evt.target.value)}
                                    placeholder={t("add-vault-page.section-confirm.plc-password1")}
                                    type="password"
                                    value={password}
                                />
                                {passwordError && (
                                    <ErrorMessage>
                                        <Icon icon="error" color={Colors.RED2} />&nbsp;&nbsp;
                                        {passwordError}
                                    </ErrorMessage>
                                )}
                            </td>
                        </tr>
                        {props.vaultIsNew && (
                            <tr>
                                <th>{t("add-vault-page.section-confirm.vault-password-confirm")}</th>
                                <td>
                                    <InputGroup
                                        onChange={evt => setPassword2(evt.target.value)}
                                        placeholder={t("add-vault-page.section-confirm.plc-password2")}
                                        type="password"
                                        value={password2}
                                    />
                                    {passwordError2 && (
                                    <ErrorMessage>
                                        <Icon icon="error" color={Colors.RED2} />&nbsp;&nbsp;
                                        {passwordError2}
                                    </ErrorMessage>
                                )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </DetailsTable>
                <RightAlign>
                    <Button
                        disabled={continueDisabled}
                        icon="bring-data"
                        intent={Intent.PRIMARY}
                        text={t("add-vault-page.section-confirm.add-button.text")}
                        title={t("add-vault-page.section-confirm.add-button.title")}
                    />
                </RightAlign>
            </Card>
        </>
    );
}
