import { connect } from "react-redux";
import MyButtercupArchiveChooser from "../components/MyButtercupArchiveChooser.js";
import { fetchAccountDetails } from "../library/myButtercup.js";
import { notifyError } from "../library/notify.js";
import { getOrganisations } from "../../shared/selectors/myButtercup.js";

export default connect(
    (state, ownProps) => ({
        organisations: getOrganisations(state)
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
        }
    }
)(MyButtercupArchiveChooser);
