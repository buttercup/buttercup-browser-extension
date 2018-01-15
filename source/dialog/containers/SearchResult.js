import { connect } from "react-redux";
import SearchResult from "../components/SearchResult.js";
import { getEntryResultTitle, getEntryResultURL } from "../../shared/selectors/searching.js";
import { sendCredentialsToTab } from "../library/messaging.js";

export default connect(
    (state, ownProps) => ({
        title: getEntryResultTitle(state, ownProps.sourceID, ownProps.entryID),
        url: getEntryResultURL(state, ownProps.sourceID, ownProps.entryID)
    }),
    {
        onEnterDetailsRequest: (sourceID, entryID, signIn = false) => () => {
            sendCredentialsToTab(sourceID, entryID, signIn);
            // @todo close
        }
    }
)(SearchResult);
