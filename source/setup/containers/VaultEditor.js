import { connect } from "react-redux";
import VaultEditor from "../components/VaultEditor.js";
import { setVaultFacade } from "../actions/vault.js";
import { getVaultFacade } from "../selectors/vault.js";
import { applyArchiveFacade, getArchiveFacade } from "../library/messaging.js";
import { notifyError, notifySuccess } from "../library/notify.js";
import { setBusy, unsetBusy } from "../../shared/actions/app.js";

export default connect(
    (state, ownProps) => ({
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
        },
        saveVaultFacade: (sourceID, facade) => dispatch => {
            dispatch(setBusy("Saving vault"));
            applyArchiveFacade(sourceID, facade)
                .then(() => getArchiveFacade(sourceID))
                .then(facade => {
                    dispatch(setVaultFacade(facade));
                })
                .then(() => {
                    dispatch(unsetBusy());
                    notifySuccess("Save successful", "Successfully updated the vault");
                })
                .catch(err => {
                    console.error(err);
                    notifyError("Failed updating archive", `Unable to update archive (${sourceID}): ${err.message}`);
                });
        }
    }
)(VaultEditor);
