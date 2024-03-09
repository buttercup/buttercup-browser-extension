import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Button, Classes, Colors, FormGroup, InputGroup, Intent } from "@blueprintjs/core";
import { Tooltip2 as Tooltip } from "@blueprintjs/popover2";
import styled from "styled-components";
import { GroupID, VaultSourceID } from "buttercup";
import { t } from "../../../../shared/i18n/trans.js";
import { UsedCredentials } from "../../../types.js";

interface NewEntrySavePromptProps {
    credentials: UsedCredentials;
    onSaveClick: (credentials: UsedCredentials) => void;
    saving: boolean;
}

const Form = styled.div`
    width: 100%;

    .${Classes.FORM_GROUP} {
        justify-content: space-between;
    }

    .${Classes.LABEL} {
        flex: 0 0 auto;
        width: 25%;
        min-width: 150px;
    }

    .${Classes.FORM_CONTENT} {
        flex: 1 1 auto;
    }
`;

const ValidityHelper = styled.span`
    color: ${Colors.RED2};
`;

function isValidInput(input: string): boolean {
    return input.trim().length > 0;
}

export function NewEntrySavePrompt(props: NewEntrySavePromptProps) {
    const { credentials, onSaveClick, saving } = props;
    const [title, setTitle] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [url, setURL] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [invalidInput, setInvalidInput] = useState<string | null>(null);
    useEffect(() => {
        setShowPassword(false);
        setTitle(credentials.title);
        setUsername(credentials.username);
        setPassword(credentials.password);
        setURL(credentials.url);
    }, [credentials]);
    const handleSaveClick = useCallback(() => {
        if (!isValidInput(title)) {
            setInvalidInput("title")
            return;
        } else if (!isValidInput(username)) {
            setInvalidInput("username")
            return;
        } else if (!isValidInput(password)) {
            setInvalidInput("password")
            return;
        } else if (!isValidInput(url)) {
            setInvalidInput("url")
            return;
        }
        onSaveClick({
            ...credentials,
            title,
            username,
            password,
            url
        });
    }, [credentials, onSaveClick, password, title, url, username]);
    return (
        <Fragment>
            <h4>{t("save-credentials-page.credentials-saver.create-new.heading")}</h4>
            <Form>
                <FormGroup
                    disabled={saving}
                    helperText={invalidInput === "title" && (
                        <ValidityHelper>
                            {t("form.invalid.required-non-empty")}
                        </ValidityHelper>
                    )}
                    inline
                    label={t("save-credentials-page.credentials-saver.create-new.label.title")}
                    labelFor="entry-title"
                    labelInfo={t("form.required")}
                >
                    <InputGroup
                        disabled={saving}
                        id="entry-title"
                        onChange={evt => setTitle(evt.target.value)}
                        placeholder={t("save-credentials-page.credentials-saver.create-new.placeholder.title")}
                        value={title}
                    />
                </FormGroup>
                <FormGroup
                    disabled={saving}
                    helperText={invalidInput === "username" && (
                        <ValidityHelper>
                            {t("form.invalid.required-non-empty")}
                        </ValidityHelper>
                    )}
                    inline
                    label={t("save-credentials-page.credentials-saver.create-new.label.username")}
                    labelFor="entry-username"
                    labelInfo={t("form.required")}
                >
                    <InputGroup
                        disabled={saving}
                        id="entry-username"
                        onChange={evt => setUsername(evt.target.value)}
                        placeholder={t("save-credentials-page.credentials-saver.create-new.placeholder.username")}
                        value={username}
                    />
                </FormGroup>
                <FormGroup
                    disabled={saving}
                    helperText={invalidInput === "password" && (
                        <ValidityHelper>
                            {t("form.invalid.required-non-empty")}
                        </ValidityHelper>
                    )}
                    inline
                    label={t("save-credentials-page.credentials-saver.create-new.label.password")}
                    labelFor="entry-password"
                    labelInfo={t("form.required")}
                >
                    <InputGroup
                        disabled={saving}
                        id="entry-password"
                        onChange={evt => setPassword(evt.target.value)}
                        rightElement={
                            <Tooltip
                                content={t(`save-credentials-page.credentials-saver.create-new.password.${showPassword ? "hide" : "show"}`)}
                            >
                                <Button
                                    icon={showPassword ? "unlock" : "lock"}
                                    intent={Intent.WARNING}
                                    minimal={true}
                                    onClick={() => setShowPassword(show => !show)}
                                />
                            </Tooltip>
                        }
                        type={showPassword ? "text" : "password"}
                        value={password}
                    />
                </FormGroup>
                <FormGroup
                    disabled={saving}
                    helperText={invalidInput === "url" && (
                        <ValidityHelper>
                            {t("form.invalid.required-non-empty")}
                        </ValidityHelper>
                    )}
                    inline
                    label={t("save-credentials-page.credentials-saver.create-new.label.url")}
                    labelFor="entry-url"
                    labelInfo={t("form.required")}
                >
                    <InputGroup
                        disabled={saving}
                        fill
                        id="entry-url"
                        onChange={evt => setURL(evt.target.value)}
                        placeholder={t("save-credentials-page.credentials-saver.create-new.placeholder.url")}
                        value={url}
                    />
                </FormGroup>
            </Form>
            <Button
                loading={saving}
                intent={Intent.SUCCESS}
                onClick={handleSaveClick}
                text={t("save-credentials-page.credentials-saver.create-new.save")}
            />
        </Fragment>
    );
}
