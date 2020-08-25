import { connect } from "react-redux";
import SettingsPage from "../components/SettingsPage.js";
import { getConfig } from "../../shared/selectors/app.js";
import { setConfig } from "../../shared/library/messaging.js";

export default connect(
    (state, ownProps) => ({
        config: getConfig(state),
    }),
    {
        onUpdateConfigValue: (key, value) => () => {
            setConfig(key, value);
        },
    }
)(SettingsPage);
