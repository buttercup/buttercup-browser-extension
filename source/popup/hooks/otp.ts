import * as OTPAuth from "otpauth";
import { useEffect, useMemo, useState } from "react";
import { OTP } from "../types.js";
import { useTimer } from "../../shared/hooks/timer.js";

export interface PreparedOTP extends OTP {
    digits: string;
    period: number;
    remaining: number;
}

function getPeriodTimeLeft(period: number): number {
    return period - (Math.floor(Date.now() / 1000) % period);
}

export function usePreparedOTPs(otps: Array<OTP>): Array<PreparedOTP> {
    const [parsedOTPs, setParsedOTPs] = useState<Record<string, OTPAuth.TOTP>>({});
    const [periods, setPeriods] = useState<Record<string, [number, number]>>({});
    useEffect(() => {
        const newParsed = { ...parsedOTPs };
        let changed = false;
        for (const otp of otps) {
            if (newParsed[otp.otpURL]) continue;
            const otpInst = OTPAuth.URI.parse(otp.otpURL) as OTPAuth.TOTP;
            if (!otpInst.period) {
                throw new Error(`OTP is invalid (no period): ${otp.otpURL}`);
            }
            newParsed[otp.otpURL] = otpInst;
            changed = true;
        }
        for (const parsed in newParsed) {
            const otp = otps.find((o) => o.otpURL === parsed);
            if (!otp) {
                // Remove non-existing
                delete newParsed[parsed];
                changed = true;
            }
        }
        if (changed) {
            setParsedOTPs(newParsed);
        }
    }, [otps, parsedOTPs]);
    useTimer(
        () => {
            setPeriods(
                Object.keys(parsedOTPs).reduce(
                    (newPeriods, url) => ({
                        ...newPeriods,
                        [url]: [parsedOTPs[url].period, getPeriodTimeLeft(parsedOTPs[url].period)]
                    }),
                    {}
                )
            );
        },
        1000,
        [parsedOTPs]
    );
    const prepared: Array<PreparedOTP> = useMemo(
        () =>
            otps.reduce((output: Array<PreparedOTP>, otp) => {
                const parsed = parsedOTPs[otp.otpURL];
                const periodInfo = periods[otp.otpURL];
                if (!parsed || !Array.isArray(periodInfo)) return output;
                return [
                    ...output,
                    {
                        ...otp,
                        otpTitle: parsed.label,
                        digits: parsed.generate(),
                        period: periodInfo[0],
                        remaining: periodInfo[1]
                    }
                ];
            }, []),
        [otps, parsedOTPs, periods]
    );
    return prepared;
}
