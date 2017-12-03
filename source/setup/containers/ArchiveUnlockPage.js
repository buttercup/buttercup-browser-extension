import { connect } from "react-redux";
import ArchiveUnlockPage from "../components/ArchiveUnlockPage.js";
import { getArchiveTitle } from "../../shared/selectors/archives.js";

export default connect(
    (state, ownProps) => ({
        archiveTitle: getArchiveTitle(state, ownProps.match.params.id)
    }),
    {}
)(ArchiveUnlockPage);
