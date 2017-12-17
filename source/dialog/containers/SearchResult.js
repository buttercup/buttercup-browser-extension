import { connect } from "react-redux";
import SearchResult from "../components/SearchResult.js";
import { getEntryResultTitle } from "../../shared/selectors/searching.js";

export default connect(
    (state, ownProps) => ({
        title: getEntryResultTitle(state, ownProps.sourceID, ownProps.id)
    }),
    {}
)(SearchResult);
