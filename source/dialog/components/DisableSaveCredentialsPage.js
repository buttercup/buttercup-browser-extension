import React, { Fragment } from "react";
import { push } from "react-router-redux";
import styled from "styled-components";
import { Button, Intent } from "@blueprintjs/core";
import { dispatch } from "../redux/index.js";
import InPagePopupBody from "./InPagePopupBody.js";
import { disableLoginForDomain } from "../library/messaging.js";
import { closeDialog } from "../library/context.js";

const ActionButton = styled(Button)`
    margin-bottom: 8px;
`;

function disableForDomain() {
    disableLoginForDomain();
    closeDialog();
}

export default function DisableSaveCredentialsPage() {
    return (
        <InPagePopupBody title="Disable Save Prompt">
            <ActionButton fill text="Disable for this domain" onClick={disableForDomain} intent={Intent.DANGER} />
            <Button fill text="Back" onClick={() => dispatch(push("/save-new-credentials"))} />
        </InPagePopupBody>
    );
}
