import { connect } from "react-redux";
import ArchivesList from "../components/ArchivesList.js";
import { getArchives } from "../../shared/selectors/archives.js";

export default connect(
    (state, ownProps) => ({
        archives: getArchives(state)
    }),
    {}
)(ArchivesList);
