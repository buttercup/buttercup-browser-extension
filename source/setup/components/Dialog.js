import React from "react";
import styled from "styled-components";
import { Classes, Colors } from "@blueprintjs/core";
import colour from "color";

const BACKGROUND_BASE = Colors.DARK_GRAY3;
const BACKGROUND_OVERLAY = colour(BACKGROUND_BASE)
    .alpha(0.7)
    .rgb()
    .string();

const DialogContainer = styled.div`
    background-color: ${props => (props.zIndex > 1 ? BACKGROUND_OVERLAY : BACKGROUND_BASE)};
    z-index: ${props => props.zIndex};
    position: ${props => (props.overlay ? "fixed" : "relative")};
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: auto !important;
`;
const Dialog = styled.div`
    ${props =>
        props.maximise &&
        `
        box-sizing: border-box;
        width: 90vw !important;
        height: 90vh !important;
    `} ${props =>
        props.maximise &&
        `
        .${Classes.DIALOG_BODY} {
            max-height: 74vh;
        }
    `};
`;

export default ({ title, children, actions, maximise = false, zIndex = 1, overlay = true }) => (
    <DialogContainer className={Classes.DIALOG_CONTAINER} zIndex={zIndex} overlay={overlay}>
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
