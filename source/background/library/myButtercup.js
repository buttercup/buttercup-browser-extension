import { dispatch } from "../redux/index.js";
import { MyButtercupClient } from "../../shared/library/buttercup.js";
import {
    MYBUTTERCUP_CLIENT_ID,
    MYBUTTERCUP_CLIENT_SECRET,
    MYBUTTERCUP_REDIRECT_URI
} from "../../shared/library/myButtercup.js";
import { setVaultID } from "../../shared/actions/myButtercup.js";
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
    return client.fetchUserArchiveDetails().then(({ id }) => {
        log.info(`Received My Buttercup vault ID: ${id}`);
        dispatch(setVaultID(id));
    });
}
