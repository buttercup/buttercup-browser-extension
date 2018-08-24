import { connect } from "react-redux";
import SaveNewCredentialsPage from "../components/SaveNewCredentialsPage.js";
import { destroyLastLogin, getLastLogin } from "../library/messaging.js";
import { closeDialog, openURL } from "../library/context.js";
import { getExtensionURL } from "../../shared/library/extension.js";

export default connect(
    (state, ownProps) => ({}),
    {
        cancelSavingCredentials: () => () => {
            destroyLastLogin();
            closeDialog();
        },
        fetchCredentials: () => () => getLastLogin(),
        openSaveForm: () => () => {
            openURL(getExtensionURL("setup.html#/save-new-credentials"));
            closeDialog();
        }
    }
)(SaveNewCredentialsPage);
