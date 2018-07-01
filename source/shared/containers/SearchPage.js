import { connect } from "react-redux";
import SearchPage from "../components/SearchPage.js";
import { getSourcesCount } from "../selectors/searching.js";
import { inPopup } from "../library/extension.js";

export default connect(
    (state, ownProps) => ({
        availableSources: getSourcesCount(state)
    }),
    {
        onPrepareFirstResults: () => () => {
            if (inPopup()) {
                const { clearSearchResults } = require("../../popup/library/messaging.js");
                clearSearchResults();
            } else {
                const { getTopURL } = require("../../dialog/library/context.js");
                const { searchEntriesForURL } = require("../library/messaging.js");
                getTopURL()
                    .then(url => searchEntriesForURL(url))
                    .catch(err => {
                        console.error(err);
                    });
            }
        }
    }
)(SearchPage);
