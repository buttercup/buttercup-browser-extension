import { connect } from "react-redux";
import MyButtercupArchiveChooser from "../components/MyButtercupArchiveChooser.js";
import { checkAccountStatus, fetchAccountDetails } from "../library/myButtercup.js";
import { notifyError } from "../library/notify.js";
import { getOrganisationArchives, getOrganisations, getSelectedArchives } from "../../shared/selectors/myButtercup.js";
import { toggleSelectedArchive } from "../../shared/actions/myButtercup.js";
import { setMyBcupAccountReady } from "../actions/addArchive.js";
import { myButtercupAccountReady } from "../selectors/addArchive.js";

export default connect(
    (state, ownProps) => ({
        accountReady: myButtercupAccountReady(state),
        organisationArchives: getOrganisationArchives(state),
        organisations: getOrganisations(state),
        selectedArchives: getSelectedArchives(state)
    }),
    {
        onInitialise: masterPassword => async dispatch => {
            try {
                await checkAccountStatus(masterPassword);
            } catch (err) {
                console.error(err);
                notifyError(
                    "Failed fetching account information",
                    `Failed while attempting to check account status: ${err.message}`
                );
                return;
            }
            try {
                await fetchAccountDetails();
            } catch (err) {
                console.error(err);
                notifyError(
                    "Failed fetching account information",
                    `Unable to retrieve account details: ${err.message}`
                );
            }
            dispatch(setMyBcupAccountReady(true));
        },
        toggleSelectedArchive
    }
)(MyButtercupArchiveChooser);
