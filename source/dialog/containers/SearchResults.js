import { connect } from "react-redux";
import SearchResults from "../components/SearchResults.js";
import { getEntryResults, getSourcesCount } from "../../shared/selectors/searching.js";
import { sendCredentialsToTab } from "../library/messaging.js";
import { closeDialog } from "../library/context.js";

export default connect(
    (state, ownProps) => ({
        entries: getEntryResults(state),
        sourcesUnlocked: getSourcesCount(state)
    }),
    {
        onEnterDetailsRequest: (sourceID, entryID, signIn = false) => () => {
            console.log(sourceID, entryID);
            sendCredentialsToTab(sourceID, entryID, signIn);
            closeDialog();
        }
    }
)(SearchResults);
