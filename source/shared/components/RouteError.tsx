import React from "react";
import styled from "styled-components";
import { useRouteError } from "react-router-dom";
import { Callout, Intent } from "@blueprintjs/core";
import { t } from "../i18n/trans.js";

const ErrorCallout = styled(Callout)`
    margin: 4px;
    box-sizing: border-box;
    width: calc(100% - 8px) !important;
    height: calc(100% - 8px) !important;
    overflow: scroll;
`;
const PreForm = styled.pre`
    margin: 0px;
`;

function stripBlanks(txt = "") {
    return txt
        .split(/(\r\n|\n)/g)
        .filter(ln => ln.trim().length > 0)
        .join("\n");
}

export function RouteError() {
    const err = useRouteError() as Error | null;
    if (!err) return null;
    return (
        <ErrorCallout intent={Intent.DANGER} icon="heart-broken" title="Error">
                <p>{t("error.fatal-boundary")}</p>
                {(!err.stack || err.stack.includes(err.message) === false) && (
                    <code>
                        <PreForm>{err.message}</PreForm>
                    </code>
                )}
                {err.stack && (
                    <code>
                        <PreForm>{stripBlanks(err.stack)}</PreForm>
                    </code>
                )}
            </ErrorCallout>
    );
}
