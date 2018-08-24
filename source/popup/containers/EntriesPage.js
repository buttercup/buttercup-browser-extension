import { connect } from "react-redux";
import EntriesPage from "../components/EntriesPage.js";
import { clearSearchResults } from "../library/messaging.js";

export default connect(
    (state, ownProps) => ({}),
    {
        onPrepare: () => () => {
            clearSearchResults();
        }
    }
)(EntriesPage);
