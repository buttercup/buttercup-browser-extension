import { connect } from "react-redux";
import SearchPage from "../components/SearchPage.js";
import { getSourcesCount } from "../../shared/selectors/searching.js";
import { getTopURL } from "../library/context.js";
import { searchEntriesForURL } from "../../shared/library/messaging.js";

export default connect(
    (state, ownProps) => ({
        availableSources: getSourcesCount(state)
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
)(SearchPage);
