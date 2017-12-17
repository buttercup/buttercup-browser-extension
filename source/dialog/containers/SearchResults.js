import { connect } from "react-redux";
import SearchResults from "../components/SearchResults.js";
import { getTopURL } from "../library/context.js";
import { searchEntriesForURL } from "../library/messaging.js";
import { getEntryResults, getSourcesCount } from "../../shared/selectors/searching.js";

export default connect(
    (state, ownProps) => ({
        entries: getEntryResults(state),
        sourcesUnlocked: getSourcesCount(state)
    }),
    {
        onPrepareFirstResults: () => () => {
            getTopURL()
                .then(url => searchEntriesForURL(url))
                .catch(err => {
                    console.error(err);
                });
        }
    }
)(SearchResults);
