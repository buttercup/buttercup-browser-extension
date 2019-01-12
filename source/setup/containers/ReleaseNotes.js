import { connect } from "react-redux";
import ReleaseNotes from "../components/ReleaseNotes.js";
import { getReleaseNotes } from "../selectors/releaseNotes";
import { fetchReleaseNotes } from "../library/releaseNotes.js";

export default connect(
    (state, ownProps) => ({
        releaseNotes: getReleaseNotes(state)
    }),
    {
        onReady: () => (dispatch, getState) => {
            const releaseNotes = getReleaseNotes(getState());
            if (!releaseNotes) {
                fetchReleaseNotes();
                setTimeout(() => {
                    console.log("STATE", getState());
                }, 500);
            }
        }
    }
)(ReleaseNotes);
