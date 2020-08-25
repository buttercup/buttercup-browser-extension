import { connect } from "react-redux";
import PasswordGeneratorPage from "../components/PasswordGeneratorPage.js";
import { setGeneratedPassword } from "../library/messaging.js";

export default connect((state, ownProps) => ({}), {
    onSetPassword: password => () => {
        setGeneratedPassword(password);
    },
})(PasswordGeneratorPage);
