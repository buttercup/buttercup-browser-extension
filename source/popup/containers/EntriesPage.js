import { connect } from "react-redux";
import EntriesPage from "../components/EntriesPage.js";
import { clearSearchResults } from "../library/messaging.js";
import { searchEntriesForTerm } from "../../shared/library/messaging.js";

export default connect(
    (state, ownProps) => ({}),
    {
        onSearchTermChange: searchTerm => () => {
            if (searchTerm.trim().length > 0) {
                searchEntriesForTerm(searchTerm);
            } else {
                clearSearchResults();
            }
        }
    }
)(EntriesPage);
