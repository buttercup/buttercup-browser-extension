/*
<input type="hidden" name="archiveID" value={this.state.archiveID} onChange={(e) => this.handleChange(e)} />
<input type="hidden" name="groupID" value={this.state.groupID} onChange={(e) => this.handleChange(e)} />
*/

"use strict";

const React = require("react");

const NOPE = function() {};

class ArchiveGroupExplorer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            archives: []
        };
    }

    componentWillMount() {
        this.fetchArchivesAndGroups();
    }

    fetchArchivesAndGroups() {
        chrome.runtime.sendMessage({ command: "archives-and-groups" }, (response) => {
            console.log("RESP", response);
            // if (response && response.ok === true) {
            //     console.log("Data", response.data);
            //     response.data.values.forEach((inputValue) => {
            //         if (inputValue.type === "property") {
            //             this.setState({
            //                 [inputValue.property]: inputValue.value
            //             });
            //         }
            //     });
            //     if (response.data.url) {
            //         this.setState({
            //             url: response.data.url 
            //         });
            //     }
            // } else {
            //     alert("There was an error fetching the submitted details:\n" + response.error);
            //     closeTab();
            // }
        });
    }

    render() {
        return <div>

        </div>;
    }

}

module.exports = ArchiveGroupExplorer;
