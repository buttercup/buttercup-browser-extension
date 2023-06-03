import React, { KeyboardEvent, useCallback } from "react";
import { Button, ControlGroup, InputGroup, Intent } from "@blueprintjs/core";
import styled from "styled-components";
import { t } from "../../../../shared/i18n/trans.js";

interface CodeInputProps {
    authenticating: boolean;
    onChange: (newValue: string) => void;
    onSubmit: () => void;
    value: string;
}

const Container = styled.div`
    width: 100%;
    margin-top: 32px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export function CodeInput(props: CodeInputProps) {
    const handleKeyPress = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
        if ((event.key === "Enter" || event.keyCode === 13) && !event.ctrlKey && !event.shiftKey) {
            props.onSubmit();
        }
    }, [props.onSubmit]);
    return (
        <Container>
            <ControlGroup>
                <InputGroup
                    autoFocus
                    disabled={props.authenticating}
                    leftIcon="key"
                    large
                    onChange={evt => props.onChange(evt.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={t("connect-page.code-plc")}
                    type="password"
                    value={props.value}
                />
                <Button
                    icon="arrow-right"
                    intent={Intent.PRIMARY}
                    loading={props.authenticating}
                    onClick={() => props.onSubmit()}
                    minimal
                />
            </ControlGroup>
        </Container>
    )
}
