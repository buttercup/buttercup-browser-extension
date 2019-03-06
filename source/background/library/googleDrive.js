import watch from "redux-watch";
import ms from "ms";
import uuid from "uuid/v4";
import sleep from "sleep-promise";
import store, { dispatch, getState } from "../redux/index.js";
import { clearGoogleDriveState, setAuthID, setAuthToken } from "../../shared/actions/googleDrive.js";
import { performAuthentication } from "../../shared/library/googleDrive.js";
import { getAuthID, getAuthToken } from "../../shared/selectors/googleDrive.js";
import { closeTabs } from "../../shared/library/extension.js";
import { getArchiveManager } from "./buttercup.js";

export async function reAuthGoogleDrive(sourceID, masterPassword) {
    const authID = uuid();
    dispatch(setAuthToken(null));
    dispatch(setAuthID(authID));
    const cleanup = async () => {
        clearTimeout(timeout);
        await closeTabs(tab.id);
    };
    const watchAuthID = watch(() => getAuthToken(getState()));
    const unsubscribe = store.subscribe(
        watchAuthID(token => {
            if (token) {
                const firedAuthID = getAuthID(getState());
                if (firedAuthID === authID) {
                    dispatch(clearGoogleDriveState());
                    updateGoogleAuthToken(sourceID, masterPassword, token);
                }
                cleanup();
            }
        })
    );
    await sleep(3000);
    const timeout = setTimeout(cleanup, ms("5m"));
    const tab = await performAuthentication();
}

async function updateGoogleAuthToken(sourceID, masterPassword, token) {
    const archiveManager = await getArchiveManager();
    const source = archiveManager.getSourceForID(sourceID);
    await source.updateSourceCredentials(masterPassword, (sourceCredentials, datasource) => {
        const datasourceDescriptionRaw = sourceCredentials.getValueOrFail("datasource");
        const datasourceDescription =
            typeof datasourceDescriptionRaw === "string"
                ? JSON.parse(datasourceDescriptionRaw)
                : datasourceDescriptionRaw;
        datasourceDescription.token = token;
        sourceCredentials.setValue("datasource", datasourceDescription);
        if (datasource) {
            datasource.token = token;
        }
    });
    await archiveManager.dehydrateSource(source);
}
