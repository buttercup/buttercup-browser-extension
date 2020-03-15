import { connect } from "react-redux";
import { push } from "react-router-redux";
import SaveNewCredentialsPage from "../components/SaveNewCredentialsPage.js";
import { destroyLastLogin, getLastLogins } from "../library/messaging.js";
import { closeDialog, openURL } from "../library/context.js";
import { getExtensionURL } from "../../shared/library/extension.js";

export default connect(
    (state, ownProps) => ({}),
    {
        cancelSavingCredentials: () => () => {
            destroyLastLogin();
            closeDialog();
        },
        disableSavePrompt: () => dispatch => {
            dispatch(push("/save-new-credentials/disable"));
        },
        fetchCredentials: () => () => getLastLogins(),
        openSaveForm: () => () => {
            openURL(getExtensionURL("setup.html#/save-new-credentials"));
            closeDialog();
        }
    }
)(SaveNewCredentialsPage);
