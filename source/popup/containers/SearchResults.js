import { connect } from "react-redux";
import SearchResults from "../components/SearchResults.js";
import { getEntryResults } from "../../shared/selectors/searching.js";
import { getUnlockedArchivesCount } from "../../shared/selectors/archives.js";
import { requestCredentialsOpening } from "../library/messaging.js";
import { createNewTab, getExtensionURL } from "../../shared/library/extension.js";

export default connect(
    (state, ownProps) => ({
        entries: getEntryResults(state),
        sourcesUnlocked: getUnlockedArchivesCount(state)
    }),
    {
        onSelectEntry: (sourceID, entryID, autoSignIn) => () => {
            requestCredentialsOpening(sourceID, entryID, autoSignIn);
        },
        onUnlockAllArchives: () => () => {
            createNewTab(getExtensionURL("setup.html#/unlock"));
        }
    }
)(SearchResults);
