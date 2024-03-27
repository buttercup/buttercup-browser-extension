import { SearchResult } from "buttercup";
import { Layerr } from "layerr";
import * as OTPAuth from "otpauth";

function extractFirstOTPURI(entry: SearchResult): string | null {
    let key: string, value: string;
    for (const prop in entry.properties) {
        if (!/^otpauth:\/\//.test(entry.properties[prop])) continue;
        if (!key || prop.length < key.length) {
            key = prop;
            value = entry.properties[prop];
        }
    }
    return value ?? null;
}

export function otpURIToDigits(uri: string): string {
    try {
        const otp = OTPAuth.URI.parse(uri);
        return otp.generate();
    } catch (err) {
        throw new Layerr(err, "Failed generating OTP code for URI");
    }
}

export function searchResultToOTP(entry: SearchResult): string | null {
    const uri = extractFirstOTPURI(entry);
    if (!uri) return null;
    return otpURIToDigits(uri);
}
