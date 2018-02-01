import { connect } from "react-redux";
import SaveCredentialsPage from "../components/SaveCredentialsPage.js";
import { getArchives } from "../../shared/selectors/archives.js";
import { getLastLogin } from "../library/messaging.js";
import { notifyError, notifySuccess } from "../library/notify.js";
import { setBusy, unsetBusy } from "../../shared/actions/app.js";
import { closeCurrentTab } from "../../shared/library/extension.js";

function processArchives(state) {
    return getArchives(state).filter(archiveSource => archiveSource.state === "unlocked");
}

export default connect(
    (state, ownProps) => ({
        archives: processArchives(state)
    }),
    {
        fetchLoginDetails: () => () => getLastLogin()
    }
)(SaveCredentialsPage);
