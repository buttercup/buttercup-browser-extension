import { SearchResult } from "buttercup";
import { Intent } from "@blueprintjs/core";
import { otpURIToDigits } from "../../shared/library/otp.js";
import { getToaster } from "../../shared/services/notifications.js";
import { localisedErrorMessage } from "../../shared/library/error.js";
import { t } from "../../shared/i18n/trans.js";
import { OTP, TabEvent, TabEventType } from "../types.js";

export function sendEntryResultToTabForInput(formID: string, entry: SearchResult): void {
    if (!formID) {
        throw new Error("No form ID found for dialog");
    }
    sendTabEvent({
        formID,
        inputDetails: {
            username: entry.properties.username ?? null,
            password: entry.properties.password ?? null
        },
        type: TabEventType.InputDetails
    });
}

export function sendOTPToTabForInput(formID: string, otp: OTP): void {
    if (!formID) {
        throw new Error("No form ID found for dialog");
    }
    let code: string = "";
    try {
        code = otpURIToDigits(otp.otpURL);
    } catch (err) {
        console.error(err);
        getToaster().show({
            intent: Intent.DANGER,
            message: t("error.otp-generate", { message: localisedErrorMessage(err) }),
            timeout: 10000
        });
    }
    sendTabEvent({
        formID,
        inputDetails: {
            otp: code
        },
        type: TabEventType.InputDetails
    });
}

function sendTabEvent(event: TabEvent, target: MessageEventSource = window.parent): void {
    (target as Window).postMessage(event, "*");
}
