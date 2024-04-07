import { Layerr } from "layerr";
import { AsyncResult, useAsync } from "../../shared/hooks/async.js";
import { sendBackgroundMessage } from "../../shared/services/messaging.js";
import { BackgroundMessageType, UsedCredentials } from "../types.js";
import { useCallback } from "react";

async function getAllCredentials(): Promise<Array<UsedCredentials | null>> {
    const resp = await sendBackgroundMessage({
        type: BackgroundMessageType.GetSavedCredentials
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed fetching saved credentials");
    }
    return resp.credentials ?? [];
}

async function getCredentialsForID(id: string): Promise<UsedCredentials | null> {
    const resp = await sendBackgroundMessage({
        credentialsID: id,
        type: BackgroundMessageType.GetSavedCredentialsForID
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed fetching saved credentials");
    }
    return resp.credentials?.[0] ?? null;
}

export function useAllLoginCredentials(): AsyncResult<Array<UsedCredentials | null>> {
    const getCredentials = useCallback(() => getAllCredentials(), []);
    const result = useAsync(getCredentials, [getCredentials]);
    return result;
}

export function useLoginCredentials(loginID: string | null): AsyncResult<UsedCredentials | null> {
    const getCredentials = useCallback(async () => (loginID ? await getCredentialsForID(loginID) : null), [loginID]);
    const result = useAsync(getCredentials, [getCredentials]);
    return result;
}
