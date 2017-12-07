import { connect } from "react-redux";
import stripTags from "striptags";
import joinURL from "url-join";
import AddArchivePage from "../components/AddArchivePage.js";
import {
    getSelectedArchiveType,
    getSelectedFilename,
    isConnected,
    isConnecting,
    selectedFileNeedsCreation
} from "../selectors/addArchive.js";
import { createRemoteFile, selectRemoteFile, setAdding, setConnected, setConnecting } from "../actions/addArchive.js";
import { connectWebDAV } from "../library/remote.js";
import { notifyError, notifySuccess } from "../library/notify.js";
import { addNextcloudArchive, addOwnCloudArchive, addWebDAVArchive } from "../library/archives.js";
import { setBusy, unsetBusy } from "../../shared/actions/app.js";

export default connect(
    (state, ownProps) => ({
        isConnected: isConnected(state),
        isConnecting: isConnecting(state),
        selectedArchiveType: getSelectedArchiveType(state),
        selectedFilename: getSelectedFilename(state),
        selectedFilenameNeedsCreation: selectedFileNeedsCreation(state)
    }),
    {
        onChooseWebDAVBasedArchive: (type, archiveName, masterPassword, url, username, password) => (
            dispatch,
            getState
        ) => {
            const name = stripTags(archiveName);
            if (/^[^\s]/.test(name) !== true) {
                notifyError(`Failed selecting ${type} archive`, `Archive name is invalid: ${name}`);
                return;
            }
            const state = getState();
            const remoteFilename = getSelectedFilename(state);
            const shouldCreate = selectedFileNeedsCreation(state);
            let addArchive;
            switch (type) {
                case "nextcloud":
                    addArchive = addNextcloudArchive;
                    break;
                case "owncloud":
                    addArchive = addOwnCloudArchive;
                    break;
                case "webdav":
                    addArchive = addWebDAVArchive;
                    break;
                default:
                    console.error(`Unable to add archive: Invalid archive type: ${type}`);
                    notifyError("Failed adding archive", `An error occurred when adding the archive: ${err.message}`);
                    return;
            }
            dispatch(setAdding(true));
            dispatch(setBusy(shouldCreate ? "Adding new archive..." : "Adding existing archive..."));
            return addArchive(name, masterPassword, remoteFilename, url, username, password, shouldCreate)
                .then(() => {
                    dispatch(unsetBusy());
                    notifySuccess("Successfully added archive", `The archive '${archiveName}' was successfully added.`);
                    setTimeout(() => {
                        window.close();
                    }, 2000);
                })
                .catch(err => {
                    dispatch(unsetBusy());
                    console.error(err);
                    notifyError(
                        `Failed selecting ${type} archive`,
                        `An error occurred when adding the archive: ${err.message}`
                    );
                    dispatch(setAdding(false));
                });
        },
        onConnectWebDAVBasedSource: (type, url, username, password) => dispatch => {
            let webdavURL;
            switch (type) {
                case "nextcloud":
                    webdavURL = joinURL(url, "remote.php/dav/files/admin");
                    break;
                case "owncloud":
                /* falls-through */
                case "nextcloud":
                    webdavURL = joinURL(url, "/remote.php/webdav");
                    break;
                default:
                    webdavURL = url;
                    break;
            }
            dispatch(setConnecting(true));
            setTimeout(() => {
                connectWebDAV(webdavURL, username, password)
                    .then(() => {
                        dispatch(setConnected(true));
                        dispatch(setConnecting(false));
                    })
                    .catch(err => {
                        console.error(err);
                        notifyError(
                            `Failed connecting to '${type}' resource`,
                            `A connection attempt to '${url}' has failed: ${err.message}`
                        );
                    });
            }, 750);
        },
        onCreateRemotePath: filename => dispatch => {
            dispatch(createRemoteFile(filename));
        },
        onSelectRemotePath: filename => dispatch => {
            dispatch(selectRemoteFile(filename));
        }
    }
)(AddArchivePage);
