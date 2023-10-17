import { Layerr } from "layerr";
import { AsyncResult, useAsync } from "../../shared/hooks/async.js";
import { sendBackgroundMessage } from "../../shared/services/messaging.js";
import { BackgroundMessageType, UsedCredentials } from "../types.js";
import { useCallback } from "react";

async function getCredentialsForID(id: string): Promise<UsedCredentials | null> {
    const resp = await sendBackgroundMessage({
        credentialsID: id,
        type: BackgroundMessageType.GetSavedCredentialsForID
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed fetching used credentials");
    }
    return resp.credentials[0] ?? null;
}

export function useLoginCredentials(loginID: string): AsyncResult<UsedCredentials | null> {
    const getCredentials = useCallback(() => getCredentialsForID(loginID), [loginID]);
    const result = useAsync(getCredentials, [getCredentials]);
    return result;
}
