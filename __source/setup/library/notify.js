import React from "react";
import { Intent } from "@blueprintjs/core";
import ms from "ms";
import Notifier, { Message } from "../components/Notifier.js";

export function notifyError(title, message) {
    Notifier.show({ message: <Message title={title} message={message} />, intent: Intent.DANGER, timeout: ms("15s") });
}

export function notifySuccess(title, message) {
    Notifier.show({ message: <Message title={title} message={message} />, intent: Intent.SUCCESS });
}

export function notifyWarning(title, message) {
    Notifier.show({ message: <Message title={title} message={message} />, intent: Intent.WARNING, timeout: ms("10s") });
}
