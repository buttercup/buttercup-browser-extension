import * as OTPAuth from "otpauth";

export function otpURIToDigits(uri: string): string {
    const otp = OTPAuth.URI.parse(uri);
    return otp.generate();
}
