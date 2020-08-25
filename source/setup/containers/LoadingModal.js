import { connect } from "react-redux";
import LoadingModal from "../components/LoadingModal.js";
import { getBusyMessage, shouldShowBusyModal } from "../../shared/selectors/app.js";

export default connect(
    (state, ownProps) => ({
        busy: shouldShowBusyModal(state),
        busyMessage: getBusyMessage(state),
    }),
    {}
)(LoadingModal);
