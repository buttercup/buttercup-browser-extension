import React, { Fragment } from "react";
import { push } from "react-router-redux";
import styled from "styled-components";
import { Button, Intent } from "@blueprintjs/core";
import { dispatch } from "../redux/index.js";
import InPagePopupBody from "./InPagePopupBody.js";
import { disableLoginForDomain } from "../library/messaging.js";
import { closeDialog, openURL } from "../library/context.js";
import { getExtensionURL } from "../../shared/library/extension.js";

const ActionButton = styled(Button)`
    margin-bottom: 8px;
`;

function disableForDomain() {
    disableLoginForDomain();
    closeDialog();
}

function manageDisabledDomains() {
    openURL(getExtensionURL("setup.html#/settings/disabled-login-domains"));
}

export default function DisableSaveCredentialsPage() {
    return (
        <InPagePopupBody title="Disable Save Prompt">
            <ActionButton fill text="Disable for this domain" onClick={disableForDomain} intent={Intent.DANGER} />
            <ActionButton fill text="Manage disabled domains" onClick={manageDisabledDomains} />
            <Button fill text="Back" onClick={() => dispatch(push("/save-new-credentials"))} />
        </InPagePopupBody>
    );
}
