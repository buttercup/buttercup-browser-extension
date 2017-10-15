import React from "react";

import ArchiveEntryForm from "./ArchiveEntryForm";
import ConnectArchiveDialog from "./ConnectArchiveDialog";

class LocalArchiveUploadForm extends ArchiveEntryForm {

    constructor(props) {
        super(props);
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    componentWillMount() {
        this.setState({
            submitEnabled: false,
            type: "local-archive-upload"
        });
    }

    readAsText(file) {
        return new Promise((resolve, reject) => {
          var reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(reader.error);
          reader.readAsText(file);
        });
    }

    handleFileChange(e) {
        e.preventDefault();
        const [file, ...rest] = e.target.files;
        return this.readAsText(file)
            .then(content => {
                this.setState({
                    submitEnabled: true,
                    localArchiveContent: content
                });
            })
    }

    renderFormContents() {
        return (
            <div>
                {super.renderFormContents()}
                <div className="row">
                    <label className="label-button">
                        Browse <input type="file" onChange={this.handleFileChange} />
                    </label>
                </div>
            </div>
        );
    }

}

export default LocalArchiveUploadForm;
