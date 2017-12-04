import { connect } from "react-redux";
import LoadingModal from "../components/LoadingModal.js";
import { getBusyMessage, shouldShowBusyModal } from "../../shared/selectors/app.js";
// import { setSelectedArchiveType } from "../actions/addArchive.js";
// import { getSelectedArchiveType } from "../selectors/addArchive.js";

export default connect(
    (state, ownProps) => ({
        busy: shouldShowBusyModal(state),
        busyMessage: getBusyMessage(state)
    }),
    {}
)(LoadingModal);
