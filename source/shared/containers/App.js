import { connect } from "react-redux";
import { getConfigKey } from "../selectors/app.js";
import App from "../components/App.js";

export default connect(
    (state, ownProps) => ({
        darkMode: getConfigKey(state, "darkMode")
    }),
    {}
)(App);
