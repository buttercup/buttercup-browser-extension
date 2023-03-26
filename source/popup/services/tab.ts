import { SearchResult } from "buttercup";
import { otpURIToDigits } from "../../shared/library/otp.js";
import { extractFirstOTPURI } from "../library/entry.js";
import { TabEvent, TabEventType } from "../types.js";

export function sendEntryResultToTabForInput(formID: string, entry: SearchResult): void {
    if (!formID) {
        throw new Error("No form ID found for dialog");
    }
    const otpURI = extractFirstOTPURI(entry);
    sendTabEvent({
        formID,
        inputDetails: {
            username: entry.properties.username ?? null,
            password: entry.properties.password ?? null,
            otp: otpURI ? otpURIToDigits(otpURI) : null
        },
        type: TabEventType.InputDetails
    });
}

function sendTabEvent(event: TabEvent, target: MessageEventSource = window.parent): void {
    (target as Window).postMessage(event, "*");
}
