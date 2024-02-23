import { LoginTarget } from "@buttercup/locust";
import { SearchResult } from "buttercup";
import { Layerr } from "layerr";
import { sendBackgroundMessage } from "../../shared/services/messaging.js";
import { BackgroundMessageType } from "../types.js";
import { searchResultToOTP } from "../../shared/library/otp.js";

async function getAutoLogin(): Promise<SearchResult | null> {
    const resp = await sendBackgroundMessage({
        type: BackgroundMessageType.GetAutoLoginForTab
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed fetching auto-login data");
    }
    return resp.autoLogin ?? null;
}

export async function processTargetAutoLogin(loginTarget: LoginTarget): Promise<void> {
    const entry = await getAutoLogin();
    if (!entry) return;
    if (entry.properties.username) {
        loginTarget.fillUsername(entry.properties.username);
    }
    if (entry.properties.password) {
        loginTarget.fillPassword(entry.properties.password);
    }
    if (loginTarget.otpField) {
        const otpDigits = searchResultToOTP(entry);
        if (otpDigits) {
            loginTarget.fillOTP(otpDigits);
        }
    }
    loginTarget.submit();
}
