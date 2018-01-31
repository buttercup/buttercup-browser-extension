import { connect } from "react-redux";
import SaveNewCredentialsPage from "../components/SaveNewCredentialsPage.js";
import { destroyLastLogin, getLastLogin } from "../library/messaging.js";
import { closeDialog } from "../library/context.js";

export default connect((state, ownProps) => ({}), {
    cancelSavingCredentials: () => () => {
        destroyLastLogin();
        closeDialog();
    },
    fetchCredentials: () => () => getLastLogin(),
    openSaveForm: () => () => {
        closeDialog();
    }
})(SaveNewCredentialsPage);
