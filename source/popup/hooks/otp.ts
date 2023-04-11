import * as OTPAuth from "otpauth";
import { useMemo } from "react";
import { OTP } from "../types.js";

export interface PreparedOTP extends OTP {
    digits: string;
}

export function usePreparedOTPs(otps: Array<OTP>): Array<PreparedOTP> {
    const prepared: Array<PreparedOTP> = useMemo(
        () =>
            otps.map((otp) => {
                const otpInst = OTPAuth.URI.parse(otp.otpURL);
                return {
                    ...otp,
                    otpTitle: otpInst.label,
                    digits: otpInst.generate()
                };
            }),
        [otps]
    );
    return prepared;
}
