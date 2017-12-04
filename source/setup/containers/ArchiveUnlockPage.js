import { connect } from "react-redux";
import ArchiveUnlockPage from "../components/ArchiveUnlockPage.js";
import { getArchiveTitle } from "../../shared/selectors/archives.js";
import { unlockArchive } from "../library/messaging.js";
import { notifyError, notifySuccess } from "../library/notify.js";

export default connect(
    (state, ownProps) => ({
        archiveTitle: getArchiveTitle(state, ownProps.match.params.id),
        sourceID: ownProps.match.params.id
    }),
    {
        onUnlockArchive: (sourceID, masterPassword) => dispatch => {
            // todo: dispatch unlocking
            unlockArchive(sourceID, masterPassword)
                .then(() => {
                    notifySuccess("Archive unlocked", "Successfully locked archive");
                    setTimeout(() => {
                        window.close();
                    }, 1250);
                })
                .catch(err => {
                    console.error(err);
                    notifyError("Failed unlocking source", `Unable to unlock source (${sourceID}): ${err.message}`);
                });
        }
    }
)(ArchiveUnlockPage);
