import React from "react";
import { Intent } from "@blueprintjs/core";
import Notifier, { Message } from "../components/Notifier.js";

export function notifyError(title, message) {
    Notifier.show({ message: <Message title={title} message={message} />, intent: Intent.DANGER });
}

export function notifySuccess(title, message) {
    Notifier.show({ message: <Message title={title} message={message} />, intent: Intent.SUCCESS });
}

export function notifyWarning(title, message) {
    Notifier.show({ message: <Message title={title} message={message} />, intent: Intent.WARNING });
}
