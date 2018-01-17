import { connect } from "react-redux";
import ArchiveTypeChooser from "../components/ArchiveTypeChooser.js";
import { setSelectedArchiveType } from "../actions/addArchive.js";
import { getSelectedArchiveType } from "../selectors/addArchive.js";

export default connect(
    (state, ownProps) => ({
        selectedArchiveType: getSelectedArchiveType(state)
    }),
    {
        onSelectArchiveType: type => dispatch => {
            dispatch(setSelectedArchiveType(type));
        }
    }
)(ArchiveTypeChooser);
