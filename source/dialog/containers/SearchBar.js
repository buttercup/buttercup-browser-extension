import { connect } from "react-redux";
import SearchBar from "../components/SearchBar.js";
import { searchEntriesForTerm, searchEntriesForURL } from "../library/messaging.js";
import { getTopURL } from "../library/context.js";

export default connect((state, ownProps) => ({}), {
    onSearchTermChange: searchTerm => () => {
        if (searchTerm.trim().length <= 0) {
            getTopURL().then(url => searchEntriesForURL(url));
        } else {
            searchEntriesForTerm(searchTerm);
        }
    }
})(SearchBar);
