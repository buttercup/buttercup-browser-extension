import { connect } from "react-redux";
import SearchBar from "../components/SearchBar.js";
import { inPopup } from "../library/extension.js";

export default connect((state, ownProps) => ({}), {
    onSearchTermChange: searchTerm => () => {
        if (inPopup()) {
            const { searchEntriesForTerm } = require("../library/messaging.js");
            const { clearSearchResults } = require("../../popup/library/messaging.js");
            if (searchTerm.trim().length > 0) {
                searchEntriesForTerm(searchTerm);
            } else {
                clearSearchResults();
            }
        } else {
            const { getTopURL } = require("../../dialog/library/context.js");
            const { searchEntriesForTerm, searchEntriesForURL } = require("../library/messaging.js");
            if (searchTerm.trim().length <= 0) {
                getTopURL().then(url => searchEntriesForURL(url));
            } else {
                searchEntriesForTerm(searchTerm);
            }
        }
    }
})(SearchBar);
