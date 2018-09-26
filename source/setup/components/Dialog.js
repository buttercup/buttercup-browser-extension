import React from "react";
import { Classes } from "@blueprintjs/core";

export default ({ title, children, actions }) => (
    <div className={Classes.DIALOG_CONTAINER}>
        <div className={Classes.DIALOG}>
            <div className={Classes.DIALOG_HEADER}>{title}</div>
            <div className={Classes.DIALOG_BODY}>{children}</div>
            <If condition={actions}>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>{actions}</div>
                </div>
            </If>
        </div>
    </div>
);
