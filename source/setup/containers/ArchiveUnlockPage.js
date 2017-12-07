import { connect } from "react-redux";
import delay from "yoctodelay";
import ArchiveUnlockPage from "../components/ArchiveUnlockPage.js";
import { getArchiveTitle } from "../../shared/selectors/archives.js";
import { removeArchive, unlockArchive } from "../library/messaging.js";
import { notifyError, notifySuccess } from "../library/notify.js";
import { setBusy, unsetBusy } from "../../shared/actions/app.js";
import { isEditing } from "../selectors/manageArchive.js";
import { setEditing } from "../actions/manageArchive.js";

export default connect(
    (state, ownProps) => ({
        archiveTitle: getArchiveTitle(state, ownProps.match.params.id),
        isEditing: isEditing(state),
        sourceID: ownProps.match.params.id
    }),
    {
        onRemoveArchive: sourceID => (dispatch, getState) => {
            const state = getState();
            const title = getArchiveTitle(state, sourceID);
            const remove = window.confirm(`Are you sure that you want to remove the archive '${title}'?`);
            if (remove) {
                dispatch(setBusy("Removing archive..."));
                dispatch(setEditing(true));
                removeArchive(sourceID)
                    .then(() => delay(500))
                    .then(() => {
                        dispatch(unsetBusy());
                        notifySuccess("Archive removed", "Successfully removed archive");
                        setTimeout(() => {
                            window.close();
                        }, 1250);
                    })
                    .catch(err => {
                        dispatch(setEditing(false));
                        console.error(err);
                        notifyError("Failed removing source", `Unable to remove source (${sourceID}): ${err.message}`);
                    });
            }
        },
        onUnlockArchive: (sourceID, masterPassword) => dispatch => {
            dispatch(setBusy("Unlocking archive..."));
            dispatch(setEditing(true));
            unlockArchive(sourceID, masterPassword)
                .then(() => {
                    dispatch(unsetBusy());
                    notifySuccess("Archive unlocked", "Successfully locked archive");
                    setTimeout(() => {
                        window.close();
                    }, 1250);
                })
                .catch(err => {
                    dispatch(setEditing(false));
                    dispatch(unsetBusy());
                    console.error(err);
                    notifyError("Failed unlocking source", `Unable to unlock source (${sourceID}): ${err.message}`);
                });
        }
    }
)(ArchiveUnlockPage);
