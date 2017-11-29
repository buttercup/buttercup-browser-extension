import { connect } from "react-redux";
import stripTags from "striptags";
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
import { addWebDAVArchive } from "../library/archives.js";

export default connect(
    (state, ownProps) => ({
        isConnected: isConnected(state),
        isConnecting: isConnecting(state),
        selectedArchiveType: getSelectedArchiveType(state),
        selectedFilename: getSelectedFilename(state),
        selectedFilenameNeedsCreation: selectedFileNeedsCreation(state)
    }),
    {
        onChooseWebDAVArchive: (archiveName, masterPassword, url, username, password) => (dispatch, getState) => {
            const name = stripTags(archiveName);
            if (/^[^\s]/.test(name) !== true) {
                notifyError("Failed selecting WebDAV archive", `Archive name is invalid: ${name}`);
                return;
            }
            const state = getState();
            const remoteFilename = getSelectedFilename(state);
            const shouldCreate = selectedFileNeedsCreation(state);
            if (shouldCreate) {
                notifyError("Failed selecting WebDAV archive", "Not implemented: Creation");
            } else {
                dispatch(setAdding(true));
                return addWebDAVArchive(name, masterPassword, remoteFilename, url, username, password)
                    .then(() => {
                        notifySuccess(
                            "Successfully added archive",
                            `The archive '${archiveName}' was successfully added.`
                        );
                        // todo: auto close
                    })
                    .catch(err => {
                        console.error(err);
                        notifyError(
                            "Failed selecting WebDAV archive",
                            `An error occurred when adding the archive: ${err.message}`
                        );
                        dispatch(setAdding(false));
                    });
            }
        },
        onConnectWebDAV: (url, username, password) => dispatch => {
            dispatch(setConnecting(true));
            setTimeout(() => {
                connectWebDAV(url, username, password)
                    .then(() => {
                        dispatch(setConnected(true));
                        dispatch(setConnecting(false));
                    })
                    .catch(err => {
                        console.error(err);
                        notifyError(
                            "Failed connecting to WebDAV resource",
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
