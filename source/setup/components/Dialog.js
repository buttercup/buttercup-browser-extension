import React from "react";
import styled from "styled-components";
import { Classes, Colors } from "@blueprintjs/core";

const DialogContainer = styled.div`
    background-color: ${Colors.DARK_GRAY3};
`;
const Dialog = styled.div`
    ${props =>
        props.maximise &&
        `
        width: 90vw !important;
        height: 90vh !important;
    `};
`;

export default ({ title, children, actions, maximise = false }) => (
    <DialogContainer className={Classes.DIALOG_CONTAINER}>
        <Dialog className={Classes.DIALOG} maximise={maximise}>
            <div className={Classes.DIALOG_HEADER}>{title}</div>
            <div className={Classes.DIALOG_BODY}>{children}</div>
            <If condition={actions}>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>{actions}</div>
                </div>
            </If>
        </Dialog>
    </DialogContainer>
);
