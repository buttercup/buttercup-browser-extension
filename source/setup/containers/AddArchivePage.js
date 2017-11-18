import { connect } from "react-redux";
import AddArchivePage from "../components/AddArchivePage.js";
import { getSelectedArchiveType } from "../selectors/addArchive.js";

export default connect((state, ownProps) => ({
    selectedArchiveType: getSelectedArchiveType(state)
}), {})(AddArchivePage);
