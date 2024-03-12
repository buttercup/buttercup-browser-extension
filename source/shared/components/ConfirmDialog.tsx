import React, { Fragment, useCallback } from "react";
import { IconName } from "@blueprintjs/icons";
import { ChildElements } from "../types.js";
import { t } from "../i18n/trans.js";
import { Button, Dialog, DialogBody, DialogFooter, Intent } from "@blueprintjs/core";

interface ConfirmDialogProps {
    children: ChildElements;
    confirmIntent?: Intent;
    confirmText?: string;
    icon?: IconName;
    isOpen: boolean;
    onCancel?: () => void;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
}

const NOOP = () => {};

export function ConfirmDialog(props: ConfirmDialogProps) {
    const {
        children,
        confirmIntent = Intent.PRIMARY,
        confirmText = t("confirm-dialog.confirm-default"),
        icon = "info-sign",
        isOpen,
        onCancel = NOOP,
        onClose,
        onConfirm,
        title
    } = props;
    const handleCancel = useCallback(() => {
        onCancel();
        onClose();
    }, [onCancel]);
    const handleConfirm = useCallback(() => {
        onConfirm();
        onClose();
    }, [onConfirm]);
    return (
        <Dialog
            icon={icon}
            isOpen={isOpen}
            onClose={handleCancel}
            title={title}
        >
            <DialogBody>
                {children}
            </DialogBody>
            <DialogFooter
                actions={(
                    <Fragment>
                        <Button intent={confirmIntent} onClick={handleConfirm}>{confirmText}</Button>
                        <Button intent={Intent.NONE} onClick={handleCancel}>{t("confirm-dialog.cancel")}</Button>
                    </Fragment>
                )}
            />
        </Dialog>
    );
}
