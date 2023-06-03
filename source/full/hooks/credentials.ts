import { useAsync } from "../../shared/hooks/async.js";
import { getCredentials } from "../services/credentials.js";
import { UsedCredentials } from "../types.js";

export function useCapturedCredentials(): [credentials: Array<UsedCredentials>, loading: boolean, error: Error | null] {
    // const { error, loading, value } = useAsync(getCredentials, []);
    // return [value, loading, error];
    return [
        [
            {
                fromEntry: false,
                id: "x123",
                password: "abc123",
                timestamp: Date.now() - 15000,
                title: "Reddit",
                url: "https://reddit.com",
                username: "user123"
            },
            {
                fromEntry: false,
                id: "sd2333",
                password: "sdasdasd",
                timestamp: Date.now() - 125000,
                title: "Microsoft Outlook",
                url: "https://login.live.com/some-page/test.aspx",
                username: "perry@test.com"
            },
            {
                fromEntry: false,
                id: "dfsdf",
                password: "dsfsfsdfsdf",
                timestamp: Date.now() - 304000,
                title: "Buttercup",
                url: "https://some-test.base-domain.buttercup.pw/other-test/page/sys/imag",
                username: "sdsknksns223"
            }
        ],
        false,
        null
    ];
}
