import { connect } from "react-redux";
import UnlockAllArchivesPage from "../components/UnlockAllArchivesPage.js";
import { getArchives } from "../../shared/selectors/archives.js";
import { unlockArchive } from "../library/messaging.js";
import { notifyError, notifySuccess } from "../library/notify.js";
import { closeCurrentTab } from "../../shared/library/extension.js";

function getArchivesArray(state) {
    return getArchives(state)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(source => ({
            title: source.title,
            sourceID: source.id,
            state: source.state
        }));
}

export default connect(
    (state, ownProps) => ({
        archives: getArchivesArray(state)
    }),
    {
        onUnlockArchive: (sourceID, masterPassword) => dispatch => {
            return unlockArchive(sourceID, masterPassword)
                .then(() => {
                    notifySuccess("Archive unlocked", "Successfully unlocked archive");
                    setTimeout(() => {}, 1250);
                    return true;
                })
                .catch(err => {
                    console.error(err);
                    notifyError("Failed unlocking archive", `Unable to unlock archive (${sourceID}): ${err.message}`);
                    return false;
                });
            // dispatch(setBusy("Unlocking archive..."));
            // dispatch(setEditing(true));
            // unlockArchive(sourceID, masterPassword)
            //     .then(() => {
            //         dispatch(unsetBusy());
            //         notifySuccess("Archive unlocked", "Successfully unlocked archive");
            //         setTimeout(() => {
            //             closeCurrentTab();
            //         }, 1250);
            //     })
            //     .catch(err => {
            //         dispatch(setEditing(false));
            //         dispatch(unsetBusy());
            //         console.error(err);
            //         notifyError("Failed unlocking archive", `Unable to unlock archive (${sourceID}): ${err.message}`);
            //     });
        }
    }
)(UnlockAllArchivesPage);
