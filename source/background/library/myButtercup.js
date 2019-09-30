import { MyButtercupClient } from "../../shared/library/buttercup.js";
import {
    MYBUTTERCUP_CLIENT_ID,
    MYBUTTERCUP_CLIENT_SECRET,
    MYBUTTERCUP_REDIRECT_URI
} from "../../shared/library/myButtercup.js";

export function getTokens(authCode) {
    return MyButtercupClient.exchangeAuthCodeForTokens(
        authCode,
        MYBUTTERCUP_CLIENT_ID,
        MYBUTTERCUP_CLIENT_SECRET,
        MYBUTTERCUP_REDIRECT_URI
    );
}
