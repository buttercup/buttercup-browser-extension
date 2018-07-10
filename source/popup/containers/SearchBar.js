import { connect } from "react-redux";
import SearchBar from "../components/SearchBar.js";
import { searchEntriesForTerm } from "../../shared/library/messaging.js";
import { clearSearchResults } from "../library/messaging.js";

export default connect((state, ownProps) => ({}), {
    onSearchTermChange: searchTerm => () => {
        if (searchTerm.trim().length > 0) {
            searchEntriesForTerm(searchTerm);
        } else {
            clearSearchResults();
        }
    }
})(SearchBar);
