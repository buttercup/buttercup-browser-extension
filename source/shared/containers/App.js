import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { getConfigKey } from "../selectors/app.js";
import App from "../components/App.js";

export default compose(
    withRouter,
    connect((state, ownProps) => ({
        darkMode: getConfigKey(state, "darkMode"),
    }))
)(App);
