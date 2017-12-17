import { connect } from "react-redux";
import SearchResult from "../components/SearchResult.js";
import { getEntryResultTitle, getEntryResultURL } from "../../shared/selectors/searching.js";

export default connect(
    (state, ownProps) => ({
        title: getEntryResultTitle(state, ownProps.sourceID, ownProps.id),
        url: getEntryResultURL(state, ownProps.sourceID, ownProps.id)
    }),
    {}
)(SearchResult);
