import React from "react";
import { Callout, Intent } from "@blueprintjs/core";
import styled from "styled-components";

interface ErrorMessageProps {
    message: string;
}

const ErrorCallout = styled(Callout)`
    margin: 4px;
    box-sizing: border-box;
    width: calc(100% - 8px) !important;
    height: calc(100% - 8px) !important;
    overflow: scroll;
`;

export function ErrorMessage(props: ErrorMessageProps) {
    return (
        <ErrorCallout intent={Intent.DANGER}>
            {props.message}
        </ErrorCallout>
    );
}
