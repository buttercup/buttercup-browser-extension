import { connect } from "react-redux";
import SaveNewCredentialsPage from "../components/SaveNewCredentialsPage.js";
// import { getSourcesCount } from "../../shared/selectors/searching.js";
// import { getTopURL } from "../library/context.js";
// import { searchEntriesForURL } from "../library/messaging.js";

export default connect(
    (state, ownProps) => ({
        credentialsTitle: ""
    }),
    {}
)(SaveNewCredentialsPage);
