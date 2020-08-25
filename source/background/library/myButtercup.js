import { dispatch } from "../redux/index.js";
import { MyButtercupClient } from "../../shared/library/buttercup.js";
import {
    MYBUTTERCUP_CLIENT_ID,
    MYBUTTERCUP_CLIENT_SECRET,
    MYBUTTERCUP_REDIRECT_URI,
} from "../../shared/library/myButtercup.js";
import { setName, setVaultID } from "../../shared/actions/myButtercup.js";
import log from "../../shared/library/log.js";

export function getTokens(authCode) {
    return MyButtercupClient.exchangeAuthCodeForTokens(
        authCode,
        MYBUTTERCUP_CLIENT_ID,
        MYBUTTERCUP_CLIENT_SECRET,
        MYBUTTERCUP_REDIRECT_URI
    );
}

export function processNewVaultDetails(accessToken, refreshToken) {
    const client = new MyButtercupClient(MYBUTTERCUP_CLIENT_ID, MYBUTTERCUP_CLIENT_SECRET, accessToken, refreshToken);
    return Promise.all([client.fetchUserVaultDetails(), client.retrieveDigest()]).then(([details, digest]) => {
        const { id } = details;
        const { account_name: name } = digest;
        log.info(`Received My Buttercup vault ID: ${id} (${name})`);
        dispatch(setVaultID(id));
        dispatch(setName(name));
    });
}
