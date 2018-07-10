import { connect } from "react-redux";
import SearchResult from "../components/SearchResult.js";
import { getEntryResultPath, getEntryResultTitle, getEntryResultURL } from "../../shared/selectors/searching.js";
import { requestCredentialsOpening } from "../library/messaging.js";

export default connect(
    (state, ownProps) => ({
        path: getEntryResultPath(state, ownProps.sourceID, ownProps.entryID),
        title: getEntryResultTitle(state, ownProps.sourceID, ownProps.entryID),
        url: getEntryResultURL(state, ownProps.sourceID, ownProps.entryID)
    }),
    {
        onSelectEntry: (sourceID, entryID) => () => {
            requestCredentialsOpening(sourceID, entryID);
        }
    }
)(SearchResult);
