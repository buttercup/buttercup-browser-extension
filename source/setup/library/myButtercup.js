import Buttercup, { MyButtercupClient } from "../../shared/library/buttercup.js";
import { dispatch, getState } from "../redux/index.js";
import { MYBUTTERCUP_CALLBACK_URL } from "../../shared/library/myButtercup.js";
import { getAuthToken } from "../../shared/selectors/myButtercup.js";
import { setOrganisationArchives, setOrganisations } from "../../shared/actions/myButtercup.js";

const myButtercupClient = MyButtercupClient.getSharedClient();

const MYBUTTERCUP_CLIENT_ID = "bcup_browser_ext";
const MYBUTTERCUP_OAUTH_URL = "http://localhost:8000/oauth/authorize";

function createOAuthURL(clientID) {
    const callback = encodeURIComponent(MYBUTTERCUP_CALLBACK_URL);
    return `${MYBUTTERCUP_OAUTH_URL}?response_type=token&client_id=${clientID}&redirect_uri=${callback}`;
}

export function fetchAccountDetails() {
    const state = getState();
    const authToken = getAuthToken(state);
    return myButtercupClient.fetchOrganisations(authToken).then(orgs => {
        dispatch(setOrganisations(orgs));
        return Promise.all(
            orgs.map(org =>
                myButtercupClient
                    .fetchOrganisationArchives(authToken, org.id)
                    .then(archives => archives.filter(archive => archive.type === "normal"))
                    .then(archives => {
                        dispatch(
                            setOrganisationArchives({
                                orgID: org.id,
                                archives
                            })
                        );
                    })
            )
        );
    });
}

export function performAuthentication() {
    const url = createOAuthURL(MYBUTTERCUP_CLIENT_ID);
    chrome.tabs.create({ url });
}
