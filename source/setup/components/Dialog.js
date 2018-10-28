import React from "react";
import styled from "styled-components";
import { Classes, Colors } from "@blueprintjs/core";

const DialogContainer = styled.div`
    background-color: ${Colors.DARK_GRAY3};
`;

export default ({ title, children, actions }) => (
    <DialogContainer className={Classes.DIALOG_CONTAINER}>
        <div className={Classes.DIALOG}>
            <div className={Classes.DIALOG_HEADER}>{title}</div>
            <div className={Classes.DIALOG_BODY}>{children}</div>
            <If condition={actions}>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>{actions}</div>
                </div>
            </If>
        </div>
    </DialogContainer>
);
