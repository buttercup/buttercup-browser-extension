import { connect } from "react-redux";
import SearchBar from "../components/SearchBar.js";
import { getTopURL } from "../library/context.js";
import { searchEntriesForTerm, searchEntriesForURL } from "../../shared/library/messaging.js";

export default connect((state, ownProps) => ({}), {
    onSearchTermChange: searchTerm => () => {
        if (searchTerm.trim().length <= 0) {
            getTopURL().then(url => searchEntriesForURL(url));
        } else {
            searchEntriesForTerm(searchTerm);
        }
    }
})(SearchBar);
