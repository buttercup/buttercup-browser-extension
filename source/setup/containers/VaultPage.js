import { connect } from "react-redux";
import VaultPage from "../components/VaultPage.js";
import { setVaultFacade } from "../actions/vault.js";
import { getVaultFacade } from "../selectors/vault.js";
import { getArchiveFacade } from "../library/messaging.js";
// import delay from "yoctodelay";
// import ArchiveUnlockPage from "../components/ArchiveUnlockPage.js";
// import { getArchiveTitle } from "../../shared/selectors/archives.js";
// import { lockArchive, removeArchive, unlockArchive } from "../library/messaging.js";
// import { notifyError, notifySuccess } from "../library/notify.js";
// import { setBusy, unsetBusy } from "../../shared/actions/app.js";
// import { isEditing } from "../selectors/manageArchive.js";
// import { setEditing } from "../actions/manageArchive.js";
// import { closeCurrentTab } from "../../shared/library/extension.js";

export default connect(
    (state, ownProps) => ({
        sourceID: ownProps.match.params.id,
        vault: getVaultFacade(state)
    }),
    {
        fetchVaultFacade: sourceID => dispatch => {
            getArchiveFacade(sourceID)
                .then(facade => {
                    dispatch(setVaultFacade(facade));
                })
                .catch(err => {
                    console.error(err);
                    notifyError("Failed fetching archive", `Unable to fetch archive (${sourceID}): ${err.message}`);
                });
        }
    }
)(VaultPage);
