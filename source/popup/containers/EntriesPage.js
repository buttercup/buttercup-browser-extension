import { connect } from "react-redux";
import EntriesPage from "../components/EntriesPage.js";
import { clearSearchResults } from "../library/messaging.js";

const NOOP = () => {};

export default connect((state, ownProps) => ({}), {
    onPrepare: () => () => {
        clearSearchResults();
    }
})(EntriesPage);
