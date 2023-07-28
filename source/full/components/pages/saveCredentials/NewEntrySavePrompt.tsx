import React, { Fragment, useEffect, useState } from "react";
import { Button, Classes, FormGroup, InputGroup, Intent } from "@blueprintjs/core";
import { Tooltip2 as Tooltip } from "@blueprintjs/popover2";
import styled from "styled-components";
import { t } from "../../../../shared/i18n/trans.js";
import { UsedCredentials } from "../../../types.js";

interface NewEntrySavePromptProps {
    credentials: UsedCredentials;
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

export function NewEntrySavePrompt(props: NewEntrySavePromptProps) {
    const { credentials } = props;
    const [title, setTitle] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [url, setURL] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    useEffect(() => {
        setShowPassword(false);
        setTitle(credentials.title);
        setUsername(credentials.username);
        setPassword(credentials.password);
        setURL(credentials.url);
    }, [credentials]);
    return (
        <Fragment>
            <h4>{t("save-credentials-page.credentials-saver.create-new.heading")}</h4>
            <Form>
                <FormGroup
                    inline
                    label={t("save-credentials-page.credentials-saver.create-new.label.title")}
                    labelFor="entry-title"
                    labelInfo={t("form.required")}
                >
                    <InputGroup
                        id="entry-title"
                        onChange={evt => setTitle(evt.target.value)}
                        placeholder={t("save-credentials-page.credentials-saver.create-new.placeholder.title")}
                        value={title}
                    />
                </FormGroup>
                <FormGroup
                    inline
                    label={t("save-credentials-page.credentials-saver.create-new.label.username")}
                    labelFor="entry-username"
                    labelInfo={t("form.required")}
                >
                    <InputGroup
                        id="entry-username"
                        onChange={evt => setUsername(evt.target.value)}
                        placeholder={t("save-credentials-page.credentials-saver.create-new.placeholder.username")}
                        value={username}
                    />
                </FormGroup>
                <FormGroup
                    inline
                    label={t("save-credentials-page.credentials-saver.create-new.label.password")}
                    labelFor="entry-password"
                    labelInfo={t("form.required")}
                >
                    <InputGroup
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
                    inline
                    label={t("save-credentials-page.credentials-saver.create-new.label.url")}
                    labelFor="entry-url"
                    labelInfo={t("form.required")}
                >
                    <InputGroup
                        fill
                        id="entry-url"
                        onChange={evt => setURL(evt.target.value)}
                        placeholder={t("save-credentials-page.credentials-saver.create-new.placeholder.url")}
                        value={url}
                    />
                </FormGroup>
            </Form>
            <Button
                intent={Intent.SUCCESS}
                text={t("save-credentials-page.credentials-saver.create-new.save")}
            />
        </Fragment>
    );
}
