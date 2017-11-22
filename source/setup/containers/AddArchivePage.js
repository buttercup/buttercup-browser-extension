import { connect } from "react-redux";
import AddArchivePage from "../components/AddArchivePage.js";
import {
    getSelectedArchiveType,
    getSelectedFilename,
    isConnected,
    isConnecting,
    selectedFileNeedsCreation
} from "../selectors/addArchive.js";
import { createRemoteFile, selectRemoteFile, setConnected, setConnecting } from "../actions/addArchive.js";
import { connectWebDAV } from "../library/remote.js";
import { notifyError } from "../library/notify.js";

export default connect(
    (state, ownProps) => ({
        isConnected: isConnected(state),
        isConnecting: isConnecting(state),
        selectedArchiveType: getSelectedArchiveType(state),
        selectedFilename: getSelectedFilename(state),
        selectedFilenameNeedsCreation: selectedFileNeedsCreation(state)
    }),
    {
        onConnectWebDAV: (url, username, password) => dispatch => {
            dispatch(setConnecting(true));
            setTimeout(() => {
                connectWebDAV(url, username, password)
                    .then(() => {
                        dispatch(setConnected(true));
                        dispatch(setConnecting(false));
                    })
                    .catch(err => {
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
