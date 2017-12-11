import { connect } from "react-redux";
import RemoteExplorer from "../components/RemoteExplorer.js";
import { setDirectoryContents, setDirectoryLoading } from "../actions/remoteFiles.js";
import { getWebDAVClient } from "../library/remote.js";
import { notifyError } from "../library/notify.js";
import log from "../../shared/library/log.js";
import { webdavContentsToTree } from "../library/webdav.js";
import { getAllDirectoryContents, getDirectoryContents, getDirectoriesLoading } from "../selectors/remoteFiles.js";

function fetchRemoteDirectory(dispatch, directory, fetchType) {
    const webdav = getWebDAVClient();
    let fetchRemoteContents;
    switch (fetchType) {
        case "webdav":
            fetchRemoteContents = dir => webdav.getDirectoryContents(dir);
            break;
        default:
            notifyError(
                "Failed fetching directory contents",
                "The remote source type was invalid for making requests against"
            );
            throw new Error(`Unknown remote fetch type: ${fetchType}`);
    }
    dispatch(
        setDirectoryLoading({
            directory,
            isLoading: true
        })
    );
    return fetchRemoteContents(directory)
        .then(contents => {
            log.info(`Received ${fetchType} directory contents: ${directory}`, contents);
            dispatch(
                setDirectoryContents({
                    directory,
                    contents
                })
            );
            dispatch(
                setDirectoryLoading({
                    directory,
                    isLoading: false
                })
            );
        })
        .catch(err => {
            notifyError(
                "Failed fetching directory contents",
                `Failed fetching the remote contents of '${directory}': ${err.message}`
            );
            log.error(`Failed fetching ${fetchType} contents of '${directory}': ${err.message}`);
            dispatch(
                setDirectoryLoading({
                    directory,
                    isLoading: false
                })
            );
            // @todo set errored?
        });
}

export default connect(
    (state, ownProps) => ({
        directoriesLoading: getDirectoriesLoading(state),
        rootDirectory: webdavContentsToTree(getAllDirectoryContents(state))
    }),
    {
        onOpenDirectory: (directory, fetchType) => (dispatch, getState) => {
            const state = getState();
            const dirContents = getDirectoryContents(state, directory);
            if (!dirContents) {
                fetchRemoteDirectory(dispatch, directory, fetchType);
            }
        },
        onReady: fetchType => dispatch => {
            fetchRemoteDirectory(dispatch, "/", fetchType);
        }
    }
)(RemoteExplorer);
