import { SearchResult } from "buttercup";
import { otpURIToDigits } from "../../shared/library/otp.js";
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
    sendTabEvent({
        formID,
        inputDetails: {
            otp: otpURIToDigits(otp.otpURL)
        },
        type: TabEventType.InputDetails
    });
}

function sendTabEvent(event: TabEvent, target: MessageEventSource = window.parent): void {
    (target as Window).postMessage(event, "*");
}
