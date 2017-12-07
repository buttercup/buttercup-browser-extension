import { connect } from "react-redux";
import WebDAVExplorer from "../components/WebDAVExplorer.js";
import { setDirectoryContents, setDirectoryLoading } from "../actions/webdav.js";
import { getWebDAVClient } from "../library/remote.js";
import { notifyError } from "../library/notify.js";
import log from "../../shared/library/log.js";
import { webdavContentsToTree } from "../library/webdav.js";
import { getAllDirectoryContents, getDirectoryContents, getDirectoriesLoading } from "../selectors/webdav.js";

function fetchRemoteDirectory(dispatch, directory) {
    const webdav = getWebDAVClient();
    dispatch(
        setDirectoryLoading({
            directory,
            isLoading: true
        })
    );
    return webdav
        .getDirectoryContents(directory)
        .then(contents => {
            log.info(`Received WebDAV directory contents: ${directory}`, contents);
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
            log.error(`Failed fetching WebDAV contents of '${directory}': ${err.message}`);
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
        onOpenDirectory: directory => (dispatch, getState) => {
            const state = getState();
            const dirContents = getDirectoryContents(state, directory);
            if (!dirContents) {
                fetchRemoteDirectory(dispatch, directory);
            }
        },
        onReady: () => dispatch => {
            fetchRemoteDirectory(dispatch, "/");
        }
    }
)(WebDAVExplorer);
