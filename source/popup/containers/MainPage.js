import { connect } from "react-redux";
import MainPage from "../components/MainPage.js";

function getArchives(state) {
    return [
        {
            id: "1",
            title: "Perry's archive",
            type: "owncloud",
            state: "unlocked"
        },
        {
            id: "2",
            title: "Sallar's archive",
            type: "dropbox",
            state: "pending"
        },
        {
            id: "3",
            title: "Testing",
            type: "nextcloud",
            state: "locked"
        },
        {
            id: "1",
            title: "Perry's archive",
            type: "owncloud",
            state: "unlocked"
        },
        {
            id: "2",
            title: "Sallar's archive",
            type: "dropbox",
            state: "pending"
        },
        {
            id: "3",
            title: "Testing",
            type: "nextcloud",
            state: "locked"
        },
        {
            id: "1",
            title: "Perry's archive",
            type: "owncloud",
            state: "unlocked"
        },
        {
            id: "2",
            title: "Sallar's archive",
            type: "dropbox",
            state: "pending"
        },
        {
            id: "3",
            title: "Testing",
            type: "nextcloud",
            state: "locked"
        }
    ];
}

export default connect((state, ownProps) => ({
    archives: getArchives(state)
}), {})(MainPage);
