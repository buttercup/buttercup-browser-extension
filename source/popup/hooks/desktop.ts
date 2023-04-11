import { Intent } from "@blueprintjs/core";
import { SearchResult } from "buttercup";
import { useCallback, useEffect, useState } from "react";
import { useAsync, useAsyncWithTimer } from "../../shared/hooks/async.js";
import { t } from "../../shared/i18n/trans.js";
import { localisedErrorMessage } from "../../shared/library/error.js";
import { getToaster } from "../../shared/services/notifications.js";
import {
    getDesktopConnectionAvailable,
    getOTPs,
    getVaultSources,
    searchEntriesByTerm,
    searchEntriesByURL
} from "../queries/desktop.js";
import { DesktopConnectionState, OTP, VaultSourceDescription } from "../types.js";

const OTPS_UPDATE_DELAY = 7500;
const SEARCH_DEBOUNCE = 600;
const SOURCES_UPDATE_DELAY = 3500;

export function useDesktopConnectionState(): DesktopConnectionState {
    const checkConnection = useCallback(async () => {
        const isAvailable = await getDesktopConnectionAvailable();
        return isAvailable;
    }, []);
    const { value, error } = useAsync(checkConnection, [checkConnection]);
    useEffect(() => {
        if (!error) return;
        console.error(error);
        const message = t("error.desktop.connection-check-failed", { message: localisedErrorMessage(error) });
        getToaster().show(
            {
                intent: Intent.DANGER,
                message,
                timeout: 10000
            },
            btoa(message)
        );
    }, [error]);
    if (error) {
        return DesktopConnectionState.Error;
    } else if (value === true) {
        return DesktopConnectionState.Connected;
    } else if (value === false) {
        return DesktopConnectionState.NotConnected;
    }
    return DesktopConnectionState.Pending;
}

export function useEntriesForURL(url: string): Array<SearchResult> {
    const performSearch = useCallback(async () => {
        if (!url) return [];
        const results = await searchEntriesByURL(url);
        return results;
    }, [url]);
    const { value, error } = useAsync(performSearch, [performSearch]);
    useEffect(() => {
        if (!error) return;
        console.error(error);
        getToaster().show({
            intent: Intent.DANGER,
            message: t("error.desktop.search-failed", { message: localisedErrorMessage(error) }),
            timeout: 10000
        });
    }, [error]);
    return value === null ? [] : value;
}

export function useOTPs(): Array<OTP> {
    const getItems = useCallback(getOTPs, []);
    const { value: rawOTPs, error } = useAsyncWithTimer(getItems, OTPS_UPDATE_DELAY, [getItems]);
    const [otps, setOTPs] = useState<Array<OTP>>([]);
    useEffect(() => {
        if (!error) return;
        console.error(error);
        getToaster().show({
            intent: Intent.DANGER,
            message: t("error.desktop.otps-fetch-failed", { message: localisedErrorMessage(error) }),
            timeout: 10000
        });
    }, [error]);
    useEffect(() => {
        if ((error || !rawOTPs) && otps.length > 0) {
            setOTPs([]);
            return;
        }
        if (
            Array.isArray(rawOTPs) &&
            (rawOTPs.length !== otps.length ||
                rawOTPs.some(
                    (raw) =>
                        !otps.find(
                            (otp) =>
                                raw.entryID === otp.entryID &&
                                raw.otpURL === otp.otpURL &&
                                raw.sourceID === otp.sourceID
                        )
                ))
        ) {
            setOTPs(rawOTPs);
        }
    }, [rawOTPs, otps, error]);
    return otps;
}

export function useSearchedEntries(term: string): Array<SearchResult> {
    const [currentTerm, setCurrentTerm] = useState<string>("");
    const performSearch = useCallback(async () => {
        if (/^\s*$/.test(currentTerm)) return [];
        const results = await searchEntriesByTerm(currentTerm);
        return results;
    }, [currentTerm]);
    const { value, error } = useAsync(performSearch, [performSearch]);
    useEffect(() => {
        if (!error) return;
        console.error(error);
        getToaster().show({
            intent: Intent.DANGER,
            message: t("error.desktop.search-failed", { message: localisedErrorMessage(error) }),
            timeout: 10000
        });
    }, [error]);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setCurrentTerm(term);
        }, SEARCH_DEBOUNCE);
        return () => {
            clearTimeout(timeout);
        };
    }, [term]);
    return value === null ? [] : value;
}

export function useVaultSources(): Array<VaultSourceDescription> {
    const getSources = useCallback(getVaultSources, []);
    const { value: sources, error } = useAsyncWithTimer(getSources, SOURCES_UPDATE_DELAY, [getSources]);
    useEffect(() => {
        if (!error) return;
        console.error(error);
        getToaster().show({
            intent: Intent.DANGER,
            message: t("error.desktop.sources-fetch-failed", { message: localisedErrorMessage(error) }),
            timeout: 10000
        });
    }, [error]);
    return sources === null || error ? [] : sources;
}
