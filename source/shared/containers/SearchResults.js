import { connect } from "react-redux";
import SearchResults from "../components/SearchResults.js";
import { getEntryResults, getSourcesCount } from "../../shared/selectors/searching.js";

export default connect(
    (state, ownProps) => ({
        entries: getEntryResults(state),
        sourcesUnlocked: getSourcesCount(state)
    }),
    {}
)(SearchResults);
