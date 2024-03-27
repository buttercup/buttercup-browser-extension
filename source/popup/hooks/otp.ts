import * as OTPAuth from "otpauth";
import { Layerr } from "layerr";
import { useEffect, useMemo, useState } from "react";
import { useTimer } from "../../shared/hooks/timer.js";
import { t } from "../../shared/i18n/trans.js";
import { OTP } from "../types.js";

export interface PreparedOTP extends OTP {
    digits: string;
    errored: boolean;
    period: number;
    remaining: number;
}

function getPeriodTimeLeft(period: number): number {
    return period - (Math.floor(Date.now() / 1000) % period);
}

export function usePreparedOTPs(otps: Array<OTP>): Array<PreparedOTP> {
    const [parsedOTPs, setParsedOTPs] = useState<Record<string, OTPAuth.TOTP | Error>>({});
    const [periods, setPeriods] = useState<Record<string, [number, number]>>({});
    useEffect(() => {
        const newParsed = { ...parsedOTPs };
        let changed = false;
        for (const otp of otps) {
            if (newParsed[otp.otpURL]) continue;
            try {
                const otpInst = OTPAuth.URI.parse(otp.otpURL) as OTPAuth.TOTP;
                if (!otpInst.period) {
                    throw new Error(`OTP is invalid (no period): ${otp.otpURL}`);
                }
                newParsed[otp.otpURL] = otpInst;
            } catch (err) {
                newParsed[otp.otpURL] = err;
                console.error(err);
            }
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
                        [url]:
                            parsedOTPs[url] instanceof OTPAuth.TOTP
                                ? [
                                      (parsedOTPs[url] as OTPAuth.TOTP).period,
                                      getPeriodTimeLeft((parsedOTPs[url] as OTPAuth.TOTP).period)
                                  ]
                                : [0, 0]
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
                let errored = false,
                    code: string = "";
                try {
                    if (parsed instanceof Error) {
                        throw new Layerr(parsed, "OTP was not parseable");
                    }
                    code = parsed.generate();
                } catch (err) {
                    console.error(err);
                    code = t("popup.entries.otp.code-error");
                    errored = true;
                }
                return [
                    ...output,
                    {
                        ...otp,
                        otpTitle: parsed instanceof OTPAuth.TOTP ? parsed.label : t("popup.entries.otp.label-error"),
                        digits: code,
                        errored,
                        period: periodInfo[0],
                        remaining: periodInfo[1]
                    }
                ];
            }, []),
        [otps, parsedOTPs, periods]
    );
    return prepared;
}
