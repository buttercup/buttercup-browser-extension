import React from "react";
import { Callout, Intent } from "@blueprintjs/core";
import styled from "styled-components";

interface ErrorMessageProps {
    message: string;
    scroll?: boolean;
}

const ErrorCallout = styled(Callout)`
    margin: 4px;
    box-sizing: border-box;
    width: calc(100% - 8px) !important;
    height: calc(100% - 8px) !important;
    overflow: ${p => p.scroll ? "scroll" : "hidden"};
`;

export function ErrorMessage(props: ErrorMessageProps) {
    const {
        message,
        scroll = true
    } = props;
    return (
        <ErrorCallout intent={Intent.DANGER} scroll={scroll}>
            {message}
        </ErrorCallout>
    );
}
