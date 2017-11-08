import { connect } from "react-redux";
import HeaderBar from "../components/HeaderBar.js";

export default connect((state, ownProps) => ({
    blug: () => console.log("HAI", state)
}), {})(HeaderBar);
