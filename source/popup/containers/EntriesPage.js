import { connect } from "react-redux";
import EntriesPage from "../components/EntriesPage.js";
// import { createNewTab, getExtensionURL } from "../../shared/library/extension.js";

const NOOP = () => {};

export default connect((state, ownProps) => ({}), {})(EntriesPage);
