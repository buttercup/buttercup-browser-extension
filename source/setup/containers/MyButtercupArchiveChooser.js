import { connect } from "react-redux";
import MyButtercupArchiveChooser from "../components/MyButtercupArchiveChooser.js";
import { fetchAccountDetails } from "../library/myButtercup.js";
import { notifyError } from "../library/notify.js";
import { getOrganisationArchives, getOrganisations, getSelectedArchives } from "../../shared/selectors/myButtercup.js";
import { toggleSelectedArchive } from "../../shared/actions/myButtercup.js";

export default connect(
    (state, ownProps) => ({
        organisationArchives: getOrganisationArchives(state),
        organisations: getOrganisations(state),
        selectedArchives: getSelectedArchives(state)
    }),
    {
        onReady: () => () => {
            fetchAccountDetails().catch(err => {
                console.error(err);
                notifyError(
                    "Failed fetching account information",
                    `Unable to retrieve account details: ${err.message}`
                );
            });
        },
        toggleSelectedArchive
    }
)(MyButtercupArchiveChooser);
