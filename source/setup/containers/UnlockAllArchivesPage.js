import { connect } from "react-redux";
import VError from "verror";
import UnlockAllArchivesPage from "../components/UnlockAllArchivesPage.js";
import { getArchives } from "../../shared/selectors/archives.js";
import { unlockArchive } from "../library/messaging.js";
import { notifyError, notifySuccess, notifyWarning } from "../library/notify.js";
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
        onUnlockArchive: (sourceID, masterPassword) => (dispatch, getState) => {
            const state = getState();
            const archives = getArchivesArray(state);
            const isLast = archives.filter(a => a.state !== "unlocked" && a.sourceID !== sourceID).length === 0;
            return unlockArchive(sourceID, masterPassword)
                .then(() => {
                    notifySuccess("Archive unlocked", "Successfully unlocked archive");
                    setTimeout(() => {
                        if (isLast) {
                            closeCurrentTab();
                        }
                    }, 1250);
                    return true;
                })
                .catch(err => {
                    console.error(err);
                    const { hush } = VError.info(err);
                    if (hush) {
                        notifyWarning("Authorisation failed", "The credentials were invalid - re-authenticating");
                    } else {
                        notifyError(
                            "Failed unlocking archive",
                            `Unable to unlock archive (${sourceID}): ${err.message}`
                        );
                    }
                    return false;
                });
        }
    }
)(UnlockAllArchivesPage);
