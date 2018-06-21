import { connect } from "react-redux";
import delay from "yoctodelay";
import UnlockAllArchivesPage from "../components/UnlockAllArchivesPage.js";
import { getArchiveTitle } from "../../shared/selectors/archives.js";
import { lockArchive, removeArchive, unlockArchive } from "../library/messaging.js";
import { notifyError, notifySuccess } from "../library/notify.js";
import { setBusy, unsetBusy } from "../../shared/actions/app.js";
import { isEditing } from "../selectors/manageArchive.js";
import { setEditing } from "../actions/manageArchive.js";
import { closeCurrentTab } from "../../shared/library/extension.js";

export default connect(
    (state, ownProps) => ({
        archiveTitle: getArchiveTitle(state, ownProps.match.params.id),
        isEditing: isEditing(state),
        state: ownProps.match.params.state,
        sourceID: ownProps.match.params.id
    }),
    {
        onUnlockArchive: (sourceID, masterPassword) => dispatch => {
            dispatch(setBusy("Unlocking archive..."));
            dispatch(setEditing(true));
            unlockArchive(sourceID, masterPassword)
                .then(() => {
                    dispatch(unsetBusy());
                    notifySuccess("Archive unlocked", "Successfully unlocked archive");
                    setTimeout(() => {
                        closeCurrentTab();
                    }, 1250);
                })
                .catch(err => {
                    dispatch(setEditing(false));
                    dispatch(unsetBusy());
                    console.error(err);
                    notifyError("Failed unlocking archive", `Unable to unlock archive (${sourceID}): ${err.message}`);
                });
        }
    }
)(UnlockAllArchivesPage);
